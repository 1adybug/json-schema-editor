import { FC } from "react"
import { SelectItem } from "@heroui/react"
import { FormSelect, FormSelectProps } from "soda-heroui"
import { StrictOmit } from "soda-type"

import { SchemaNameMap } from "../constants"
import { TypeEnum } from "../schema/typeEnum"

export interface TypeSelectProps extends StrictOmit<FormSelectProps<false, TypeEnum>, "children"> {}

const TypeSelect: FC<TypeSelectProps> = props => {
    return (
        <FormSelect<false, TypeEnum> {...props}>
            {Object.entries(SchemaNameMap).map(([key, value]) => (
                <SelectItem key={key}>{value}</SelectItem>
            ))}
        </FormSelect>
    )
}

export default TypeSelect
