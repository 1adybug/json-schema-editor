import { Fragment } from "react"

import { schemaOptions, withForm } from "./FormContext"

const NullSchemaEditor = withForm({
    ...schemaOptions,
    render({ form }) {
        return <Fragment></Fragment>
    },
})

export default NullSchemaEditor
