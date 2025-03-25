import { z } from "zod"

import { baseTypeSchema } from "./baseType"
import { multipleOfSchema } from "./multipleOf"
import { numberEnumSchema } from "./numberEnum"
import { precisionSchema } from "./precision"

export const numberTypeSchema = baseTypeSchema
    .extend({
        type: z.literal("number"),
        isEnum: z.boolean().optional(),
        precision: precisionSchema.optional(),
        multipleOf: multipleOfSchema.optional(),
        maximum: z.number().optional(),
        minimum: z.number().optional(),
        enum: numberEnumSchema.optional(),
    })
    .refine(data => data.minimum === undefined || data.maximum === undefined || data.minimum <= data.maximum, "最小值不能大于最大值")
