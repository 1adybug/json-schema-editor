import { z } from "zod"

import { baseTypeSchema } from "./baseType"
import { idSchema } from "./id"

export const arrayTypeSchema = baseTypeSchema.extend({
    type: z.literal("array"),
    items: idSchema,
})
