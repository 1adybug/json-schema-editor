import { z } from "zod"

import { baseTypeSchema } from "./baseType"

export const nullTypeSchema = baseTypeSchema.extend({
    type: z.literal("null"),
})
