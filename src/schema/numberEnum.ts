import { isNonNullable } from "deepsea-tools"
import { z } from "zod"

export const numberEnumItemSchema = z.union([
    z.number({ message: "无效的数字枚举值" }),
    z
        .string({ message: "无效的数字枚举值" })
        .trim()
        .transform(v => (v ? Number(v) : undefined))
        .refine(v => v === undefined || !Number.isNaN(v), { message: "无效的数字枚举值" }),
])

export const numberEnumSchema = z
    .array(numberEnumItemSchema, { message: "无效的数字枚举值" })
    .transform(v => v.filter(isNonNullable))
    .refine(v => v.length > 0, { message: "至少需要一个枚举值" })
