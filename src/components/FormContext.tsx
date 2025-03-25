import { createFormHook, createFormHookContexts, formOptions } from "@tanstack/react-form"
import { FormInput, FormNumberInput, FormTextarea } from "soda-heroui"
import { getFieldComponents } from "soda-tanstack-form"
import { CombineUnion, StrictOmit } from "soda-type"
import { v4 as uuid } from "uuid"

import { JsonSchema } from "../schema/type"
import { typeEnumSchema } from "../schema/typeEnum"
import BooleanSelect from "./BooleanSelect"
import PrecisionSelect from "./PrecisionSelect"
import SchemaSelect from "./SchemaSelect"
import TypeSelect from "./TypeSelect"

type _SchemaFormData = Required<StrictOmit<CombineUnion<JsonSchema>, "id" | "createdAt" | "updatedAt">>

export type SchemaFormData = {
    [Key in keyof _SchemaFormData]: NonNullable<_SchemaFormData[Key]> | undefined
}

export function getDefaultValues(): SchemaFormData {
    return {
        name: "",
        type: typeEnumSchema.catch("object").parse(localStorage.getItem("schema")),
        description: "",
        properties: [{ key: uuid() }],
    } as SchemaFormData
}

export const schemaOptions = formOptions({
    defaultValues: getDefaultValues(),
})

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

const fieldComponents = getFieldComponents(
    {
        SchemaSelect,
        Input: FormInput,
        NumberInput: FormNumberInput,
        Textarea: FormTextarea,
        BooleanSelect,
        PrecisionSelect,
        TypeSelect,
    },
    useFieldContext,
)

export const { useAppForm, withForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents,
    formComponents: {},
})
