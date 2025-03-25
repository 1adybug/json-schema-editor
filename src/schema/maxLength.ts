import { z } from "zod"

export const maxLengthSchema = z.union([
    z.number({ message: "最大长度必须是一个非负整数" }).int({ message: "最大长度必须是一个整数" }).min(0, { message: "最大长度必须是一个非负整数" }),
    z.undefined(),
    z
        .any()
        .refine(v => Number.isNaN(v), { message: "最大长度必须是一个非负整数" })
        .transform(v => undefined),
])
