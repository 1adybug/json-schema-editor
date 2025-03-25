import { z } from "zod"

import { arrayTypeSchema } from "./arrayType"
import { booleanTypeSchema } from "./booleanType"
import { nullTypeSchema } from "./nullType"
import { numberTypeSchema } from "./numberType"
import { objectTypeSchema } from "./objectType"
import { stringTypeSchema } from "./stringType"

export const typeSchema = z.union([objectTypeSchema, arrayTypeSchema, stringTypeSchema, numberTypeSchema, booleanTypeSchema, nullTypeSchema])

export type JsonSchema = z.infer<typeof typeSchema>
