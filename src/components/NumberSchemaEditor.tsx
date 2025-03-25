import { Fragment } from "react"

import { numberEnumSchema } from "@/schema/numberEnum"

import { schemaOptions, withForm } from "./FormContext"

const NumberSchemaEditor = withForm({
    ...schemaOptions,
    render({ form }) {
        return (
            <Fragment>
                <form.AppField name="isEnum">{field => <field.BooleanSelect label="是否是枚举" labels={["是", "否"]} />}</form.AppField>
                <form.Subscribe selector={state => state.values.isEnum}>
                    {isEnum =>
                        isEnum ? (
                            <form.AppField key="enum" name="enum" validators={{ onBlur: numberEnumSchema }}>
                                {field => (
                                    <field.Textarea
                                        label="枚举值"
                                        value={field.state.value?.join(",") || ""}
                                        onValueChange={value => field.handleChange(value.split(","))}
                                    />
                                )}
                            </form.AppField>
                        ) : (
                            <Fragment>
                                <form.AppField key="precision" name="precision">
                                    {field => <field.PrecisionSelect label="数字类型" isRequired />}
                                </form.AppField>
                                <form.AppField name="minimum">{field => <field.NumberInput label="最小值" placeholder="包含" />}</form.AppField>
                                <form.AppField name="maximum">{field => <field.NumberInput label="最大值" placeholder="包含" />}</form.AppField>
                                <form.AppField name="multipleOf">{field => <field.NumberInput label="倍数" placeholder="必须是这个数的倍数" />}</form.AppField>
                            </Fragment>
                        )
                    }
                </form.Subscribe>
            </Fragment>
        )
    },
})

export default NumberSchemaEditor
