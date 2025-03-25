import { z } from "zod"

export const patternSchema = z.union([
    z.undefined(),
    z
        .string({ message: "无效的正则表达式" })
        .transform(str => str.trim())
        .transform(str => str || undefined)
        .refine(str => {
            if (!str) return true
            try {
                new RegExp(str)
                return true
            } catch (error) {
                return false
            }
        }, "无效的正则表达式"),
])
