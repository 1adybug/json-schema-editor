import { FC } from "react"
import { SelectItem } from "@heroui/react"
import { FormSelect, FormSelectProps } from "soda-heroui"
import { StrictOmit } from "soda-type"

import { Precision } from "../schema/precision"

export interface PrecisionSelectProps extends StrictOmit<FormSelectProps<false, Precision>, "children"> {}

const PrecisionSelect: FC<PrecisionSelectProps> = props => {
    return (
        <FormSelect {...props}>
            <SelectItem key="integer">整数</SelectItem>
            <SelectItem key="number">小数</SelectItem>
        </FormSelect>
    )
}

export default PrecisionSelect
