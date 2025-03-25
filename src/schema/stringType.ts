import { z } from "zod"

import { baseTypeSchema } from "./baseType"
import { maxLengthSchema } from "./maxLength"
import { minLengthSchema } from "./minLength"
import { patternSchema } from "./pattern"
import { stringEnumSchema } from "./stringEnum"

export const stringTypeSchema = baseTypeSchema
    .extend({
        type: z.literal("string"),
        isEnum: z.boolean().optional(),
        minLength: minLengthSchema.optional(),
        maxLength: maxLengthSchema.optional(),
        pattern: patternSchema.optional(),
        enum: stringEnumSchema.optional(),
    })
    .refine(data => data.minLength === undefined || data.maxLength === undefined || data.minLength <= data.maxLength, "最小长度不能大于最大长度")
