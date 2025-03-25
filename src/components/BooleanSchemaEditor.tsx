import { Fragment } from "react"

import { schemaOptions, withForm } from "./FormContext"

const BooleanSchemaEditor = withForm({
    ...schemaOptions,
    render({ form }) {
        return <Fragment></Fragment>
    },
})

export default BooleanSchemaEditor
