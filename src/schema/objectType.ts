import { z } from "zod"

import { baseTypeSchema } from "./baseType"
import { propertySchema } from "./property"

export const objectTypeSchema = baseTypeSchema.extend({
    type: z.literal("object"),
    properties: z.array(propertySchema),
})
