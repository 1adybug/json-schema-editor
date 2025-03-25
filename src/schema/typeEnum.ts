import { z } from "zod"

export const typeEnumSchema = z.enum(["object", "array", "string", "number", "boolean", "null"])

export type TypeEnum = z.infer<typeof typeEnumSchema>
