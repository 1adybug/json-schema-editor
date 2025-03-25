import { getValidate } from "."
import { z } from "zod"

export const titleSchema = z
    .string({ message: "无效的属性名" })
    .trim()
    .min(1, "属性名不能为空")
    .regex(/^[a-zA-Z0-9]+$/, "属性名只能包含英文字母和数字")
    .regex(/^\D/, "属性名不能以数字开头")

export const titleValidate = getValidate(titleSchema)
