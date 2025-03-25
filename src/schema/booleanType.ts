import { z } from "zod"

import { baseTypeSchema } from "./baseType"

export const booleanTypeSchema = baseTypeSchema.extend({
    type: z.literal("boolean"),
})
