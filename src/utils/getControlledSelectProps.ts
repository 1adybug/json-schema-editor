import { SharedSelection } from "@heroui/react"

import { isNonNullable } from "./isNonNullable"

export type ValueProps = {
    selectedKeys: string[]
}

export interface ControlledSelectProps<T = string> {
    getValueProps: (value: T | undefined | null) => ValueProps
    normalize: (value: SharedSelection) => T | undefined | null
    trigger: "onSelectionChange"
}

export const singleConfig: ControlledSelectProps<string> = {
    getValueProps(value) {
        const selectedKeys = isNonNullable(value) ? [value] : []
        return { selectedKeys }
    },
    normalize(value) {
        return Array.from(value)?.at(0) as string | undefined
    },
    trigger: "onSelectionChange",
}

export const multipleConfig: ControlledSelectProps<string[]> = {
    getValueProps(value) {
        const selectedKeys = Array.isArray(value) ? value : []
        return { selectedKeys }
    },
    normalize(value) {
        return Array.from(value) as string[]
    },
    trigger: "onSelectionChange",
}

export function getControlledSelectProps<T = string>(config: Omit<ControlledSelectProps<T>, "trigger">): ControlledSelectProps<T> {
    return {
        ...config,
        trigger: "onSelectionChange",
    }
}
