import { z } from "zod"

export const multipleOfSchema = z.number({ message: "无效的倍数" }).positive("倍数必须为正数")
