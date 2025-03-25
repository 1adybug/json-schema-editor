import { Fragment } from "react"

import { maxLengthSchema } from "../schema/maxLength"
import { minLengthSchema } from "../schema/minLength"
import { patternSchema } from "../schema/pattern"
import { stringEnumSchema } from "../schema/stringEnum"
import { schemaOptions, withForm } from "./FormContext"

const StringSchemaEditor = withForm({
    ...schemaOptions,
    render({ form }) {
        return (
            <Fragment>
                <form.AppField name="isEnum">{field => <field.BooleanSelect label="是否是枚举" labels={["是", "否"]} />}</form.AppField>
                <form.Subscribe selector={state => state.values.isEnum}>
                    {isEnum =>
                        isEnum ? (
                            <form.AppField key="enum" name="enum" validators={{ onBlur: stringEnumSchema }}>
                                {field => (
                                    <field.Textarea
                                        label="枚举值"
                                        placeholder="枚举值，多个值用英文逗号分隔"
                                        value={field.state.value?.join(",") || ""}
                                        onValueChange={value => field.handleChange(value.split(","))}
                                    />
                                )}
                            </form.AppField>
                        ) : (
                            <Fragment>
                                <form.AppField key="minLength" name="minLength" validators={{ onBlur: minLengthSchema }}>
                                    {field => <field.NumberInput label="最小长度" min={0} step={1} />}
                                </form.AppField>
                                <form.AppField
                                    name="maxLength"
                                    validators={{
                                        onBlurListenTo: ["minLength"],
                                        onBlur({ value, fieldApi }) {
                                            const { data, error } = maxLengthSchema.safeParse(value)
                                            if (error) return error
                                            value = data!
                                            const minLength = fieldApi.form.getFieldValue("minLength")
                                            if (minLength === undefined) return false
                                            if (value < minLength) return new Error("最大长度必须不小于最小长度")
                                            return false
                                        },
                                    }}
                                >
                                    {field => <field.NumberInput label="最大长度" min={0} step={1} />}
                                </form.AppField>
                                <form.AppField name="pattern" validators={{ onBlur: patternSchema }}>
                                    {field => <field.Input label="正则表达式" description="正则表达式，如果你不知道如何填写，可以使用自动生成" />}
                                </form.AppField>
                            </Fragment>
                        )
                    }
                </form.Subscribe>
            </Fragment>
        )
    },
})

export default StringSchemaEditor
