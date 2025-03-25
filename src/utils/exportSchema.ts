import { JsonSchema } from "../schema/type"
import { useSchemas } from "../store/useSchemas"

export interface OutputBaseSchema {
    $defs?: Record<string, OutputSchema>
    $ref?: string
    title?: string
    description?: string
}

export type OutputSchema =
    | OutputBaseSchema
    | OutputObjectSchema
    | OutputArraySchema
    | OutputStringSchema
    | OutputNumberSchema
    | OutputBooleanSchema
    | OutputNullSchema
    | OutputEnumSchema

export interface OutputEnumSchema extends OutputBaseSchema {
    enum: (string | number)[]
}

export interface OutputObjectSchema extends OutputBaseSchema {
    type: "object"
    properties: Record<string, OutputSchema>
    required?: string[]
}

export interface OutputArraySchema extends OutputBaseSchema {
    type: "array"
    items: OutputSchema
}

export interface OutputStringSchema extends OutputBaseSchema {
    type: "string"
    minLength?: number
    maxLength?: number
    pattern?: string
}

export interface OutputNumberSchema extends OutputBaseSchema {
    type: "number" | "integer"
    minimum?: number
    maximum?: number
    multipleOf?: number
}

export interface OutputBooleanSchema extends OutputBaseSchema {
    type: "boolean"
}

export interface OutputNullSchema extends OutputBaseSchema {
    type: "null"
}

export function exportSchema(startId: string) {
    const defs = new Set<string>()
    const map = new Map<string, JsonSchema>()
    const output = new Map<string, OutputSchema>()

    function define(id: string) {
        if (map.has(id)) return defs.add(id)
        const schema = useSchemas.getState().find(item => item.id === id)
        if (!schema) throw new Error(`无法找到 id 为 ${id} 的 schema`)
        map.set(id, schema)
        switch (schema.type) {
            case "object":
                schema.properties?.forEach(item => define(item.id))
                break

            case "array":
                define(schema.items)
                break

            case "string":
                output.set(
                    id,
                    schema.isEnum
                        ? { title: schema.title, description: schema.description || schema.name, enum: schema.enum! }
                        : {
                              type: "string",
                              title: schema.title,
                              description: schema.description || schema.name,
                              minLength: schema.minLength,
                              maxLength: schema.maxLength,
                              pattern: schema.pattern,
                          },
                )
                break

            case "number":
                output.set(
                    id,
                    schema.isEnum
                        ? { title: schema.title, description: schema.description || schema.name, enum: schema.enum! }
                        : {
                              type: schema.precision!,
                              title: schema.title,
                              description: schema.description || schema.name,
                              minimum: schema.minimum,
                              maximum: schema.maximum,
                              multipleOf: schema.multipleOf,
                          },
                )
                break

            case "boolean":
                output.set(id, {
                    type: "boolean",
                    title: schema.title,
                    description: schema.description || schema.name,
                })
                break

            case "null":
                output.set(id, {
                    type: "null",
                    title: schema.title,
                    description: schema.description || schema.name,
                })
                break
        }
    }

    define(startId)
    
    function defineObject(id: string): OutputSchema {
        if (output.has(id)) return output.get(id)!
        const start = map.get(id)!
        if (start.type === "object") {
            const required = start.properties.filter(item => item.required).map(item => item.title)
            const schema: OutputObjectSchema = {
                type: "object",
                title: start.title,
                description: start.description || start.name,
                properties: {},
                required: required.length > 0 ? required : undefined,
            }
            if (id === startId && defs.has(startId)) {
                const finalSchema: OutputSchema = {
                    $defs: {
                        [start.title]: schema,
                    },
                    $ref: `#/$defs/${start.title}`,
                }
                output.set(id, finalSchema)
            } else {
                output.set(id, schema)
            }
            const properties = Object.fromEntries(
                start.properties.map(item => {
                    const schema = output.get(item.id) ?? defineObject(item.id)
                    return [item.title, defs.has(item.id) ? { $ref: `#/$defs/${map.get(item.id)!.title}` } : schema] as [string, OutputSchema]
                }),
            )
            schema.properties = properties
            return output.get(id)!
        }

        if (start.type === "array") {
            const schema: OutputArraySchema = {
                type: "array",
                title: start.title,
                description: start.description || start.name,
                items: undefined as unknown as OutputSchema,
            }
            if (id === startId && defs.has(startId)) {
                const finalSchema: OutputSchema = {
                    $defs: {
                        [start.title]: schema,
                    },
                    $ref: `#/$defs/${start.title}`,
                }
                output.set(id, finalSchema)
            } else {
                output.set(id, schema)
            }
            const items = output.get(start.items) ?? defineObject(start.items)
            if (defs.has(start.items)) {
                schema.items = {
                    $ref: `#/$defs/${map.get(start.items)!.title}`,
                }
            } else {
                schema.items = items
            }
            return output.get(id)!
        }

        throw new Error(`无法找到 id 为 ${id} 的 schema`)
    }

    return defineObject(startId)
}
