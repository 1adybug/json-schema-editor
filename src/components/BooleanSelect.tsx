import { FC } from "react"
import { SelectItem } from "@heroui/react"
import { FormSelect, FormSelectProps } from "soda-heroui"
import { Field } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

export interface BooleanSelectProps extends StrictOmit<FormSelectProps, "children" | "field"> {
    field: Field<boolean>
    labels: [string, string]
    defaultValue?: boolean
}

const BooleanSelect: FC<BooleanSelectProps> = ({ field, labels, defaultValue, ...rest }) => {
    return (
        <FormSelect
            selectedKeys={[String(field.state.value ?? defaultValue ?? false)]}
            onSelectionChange={keys => field.handleChange(Array.from(keys)[0] === "true")}
            field={field as unknown as Field<string>}
            {...rest}
        >
            <SelectItem key="true">{labels[0]}</SelectItem>
            <SelectItem key="false">{labels[1]}</SelectItem>
        </FormSelect>
    )
}

export default BooleanSelect
