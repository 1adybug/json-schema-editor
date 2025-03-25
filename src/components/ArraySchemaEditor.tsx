import { idSchema } from "../schema/id"
import { schemaOptions, withForm } from "./FormContext"

const ArraySchemaEditor = withForm({
    ...schemaOptions,
    render({ form }) {
        return (
            <form.AppField name="items" validators={{ onBlur: idSchema }}>
                {field => <field.SchemaSelect label="元素类型" isRequired disallowEmptySelection />}
            </form.AppField>
        )
    },
})

export default ArraySchemaEditor
