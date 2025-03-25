import { z } from "zod"

import { descriptionSchema } from "./description"
import { idSchema } from "./id"
import { nameSchema } from "./name"
import { titleSchema } from "./title"

export const baseTypeSchema = z.object({
    id: idSchema,
    name: nameSchema,
    title: titleSchema,
    description: descriptionSchema.optional(),
    createdAt: z.number(),
    updatedAt: z.number(),
})
