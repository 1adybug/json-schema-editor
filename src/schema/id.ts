import { z } from "zod"

export const idSchema = z.string({ message: "无效的 id" }).min(1, "id 不能为空")
