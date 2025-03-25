import { Button } from "@heroui/react"
import { IconArrowDown, IconArrowUp, IconMinus, IconPlus } from "@tabler/icons-react"
import { isNonNullable } from "deepsea-tools"
import { v4 as uuid } from "uuid"

import { useSchemas } from "@/store/useSchemas"

import { idSchema } from "../schema/id"
import { Property } from "../schema/property"
import { titleSchema } from "../schema/title"
import { schemaOptions, withForm } from "./FormContext"

const ObjectSchemaEditor = withForm({
    ...schemaOptions,
    render({ form }) {
        return (
            <form.Field name="properties" mode="array">
                {fields =>
                    fields.state.value?.map((item, index, array) => (
                        <div key={item.key} className="flex items-start gap-2">
                            <div className="grid flex-auto grid-cols-3 gap-2">
                                <form.AppField name={`properties[${index}].id`} validators={{ onBlur: idSchema }}>
                                    {field => <field.SchemaSelect label="schema" isRequired disallowEmptySelection />}
                                </form.AppField>
                                <form.Subscribe selector={state => state.values.properties?.[index].id}>
                                    {id => (
                                        <form.AppField
                                            name={`properties[${index}].title`}
                                            validators={{
                                                onBlurListenTo: ["properties"],
                                                onBlur({ value }) {
                                                    const title = (value as string)?.trim() || useSchemas.getState().find(item => item.id === id)?.title
                                                    const { error, data } = titleSchema.safeParse(title)
                                                    if (error) return error
                                                    if (
                                                        form.getFieldValue("properties")!.some(({ id, title }, index2) => {
                                                            if (index === index2 || !isNonNullable(id)) return false
                                                            title =
                                                                title?.trim() ||
                                                                useSchemas.getState().find(item => item.id === form.getFieldValue("properties")![index2].id)!
                                                                    .title
                                                            return title === data
                                                        })
                                                    )
                                                        return new Error(`存在同名属性: ${data}`)
                                                    return false
                                                },
                                            }}
                                        >
                                            {field => (
                                                <field.Input
                                                    label="属性名"
                                                    placeholder={useSchemas.getState().find(item => item.id === id)?.title}
                                                    isRequired
                                                    autoComplete="off"
                                                />
                                            )}
                                        </form.AppField>
                                    )}
                                </form.Subscribe>
                                <form.AppField name={`properties[${index}].required`}>
                                    {field => <field.BooleanSelect label="选择" labels={["必填", "非必填"]} isRequired disallowEmptySelection />}
                                </form.AppField>
                            </div>
                            <div className="flex h-14 flex-none items-center gap-2">
                                <Button
                                    className="text-black text-opacity-65 disabled:cursor-not-allowed disabled:text-opacity-25"
                                    radius="full"
                                    size="sm"
                                    isIconOnly
                                    aria-label="上移"
                                    variant="light"
                                    disabled={index === 0}
                                    onPress={() => fields.setValue(prev => prev?.with(index - 1, prev[index])?.with(index, prev[index - 1]))}
                                >
                                    <IconArrowUp />
                                </Button>
                                <Button
                                    className="text-black text-opacity-65 disabled:cursor-not-allowed disabled:text-opacity-25"
                                    radius="full"
                                    size="sm"
                                    isIconOnly
                                    aria-label="下移"
                                    variant="light"
                                    disabled={index === array.length - 1}
                                    onPress={() => fields.setValue(prev => prev?.with(index + 1, prev[index])?.with(index, prev[index + 1]))}
                                >
                                    <IconArrowDown />
                                </Button>
                                <Button
                                    radius="full"
                                    size="sm"
                                    isIconOnly
                                    aria-label="新增"
                                    color="primary"
                                    onPress={() =>
                                        fields.setValue(fields.state.value?.toSpliced(index + 1, 0, { key: uuid(), required: false, id: "", title: "" }))
                                    }
                                >
                                    <IconPlus />
                                </Button>
                                <Button
                                    radius="full"
                                    size="sm"
                                    isIconOnly
                                    aria-label="删除"
                                    color="danger"
                                    onPress={() =>
                                        fields.setValue(prev =>
                                            prev!.length === 1 ? [{ key: uuid(), required: false } as Property] : fields.state.value!.toSpliced(index, 1),
                                        )
                                    }
                                >
                                    <IconMinus />
                                </Button>
                            </div>
                        </div>
                    ))
                }
            </form.Field>
        )
    },
})

export default ObjectSchemaEditor
