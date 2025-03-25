import { getValidate } from "."
import { z } from "zod"

export const nameSchema = z.string({ message: "无效的名称" }).min(1, "名称不能为空")

export const nameValidate = getValidate(nameSchema)
