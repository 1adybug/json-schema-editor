import { z } from "zod"

export const stringEnumItemSchema = z.string({ message: "无效的字符串枚举值" })

export const stringEnumSchema = z
    .array(stringEnumItemSchema, { message: "无效的字符串枚举值" })
    .refine(value => value.some(item => item.trim()), "至少需要一个枚举值")
    .transform(value => value.filter(item => item.trim()))
