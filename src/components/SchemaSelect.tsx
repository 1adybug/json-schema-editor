import { FC } from "react"
import { SelectItem, SelectSection } from "@heroui/react"
import { FormSelect, FormSelectProps } from "soda-heroui"
import { StrictOmit } from "soda-type"

import { SchemaNameMap } from "../constants"
import { JsonSchema } from "../schema/type"
import { TypeEnum } from "../schema/typeEnum"
import { useSchemas } from "../store/useSchemas"

export interface SchemaSelectProps extends StrictOmit<FormSelectProps, "children"> {}

const SchemaSelect: FC<SchemaSelectProps> = props => {
    const [schemas] = useSchemas()
    const groups = schemas.reduce(
        (acc: Record<TypeEnum, JsonSchema[]>, item) => {
            acc[item.type] ??= []
            acc[item.type].push(item)
            return acc
        },
        {} as Record<TypeEnum, JsonSchema[]>,
    )

    return (
        <FormSelect {...props}>
            {Object.entries(groups).map(([key, value], index, array) => (
                <SelectSection key={key} title={SchemaNameMap[key as TypeEnum]} showDivider={index !== array.length - 1}>
                    {value.map(({ id, name }) => (
                        <SelectItem key={id}>{name}</SelectItem>
                    ))}
                </SelectSection>
            ))}
        </FormSelect>
    )
}

export default SchemaSelect
