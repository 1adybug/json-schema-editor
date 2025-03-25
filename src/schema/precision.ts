import { z } from "zod"

export const precisionSchema = z.enum(["integer", "number"])

export type Precision = z.infer<typeof precisionSchema>
