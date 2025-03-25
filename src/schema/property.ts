import { z } from "zod"

import { idSchema } from "./id"
import { requiredSchema } from "./required"
import { titleSchema } from "./title"

export const propertySchema = z.object({
    key: idSchema,
    title: titleSchema,
    id: idSchema,
    required: requiredSchema,
})

export type Property = z.infer<typeof propertySchema>
