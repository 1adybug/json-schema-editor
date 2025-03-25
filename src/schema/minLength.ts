import { z } from "zod"

export const minLengthSchema = z.union([
    z.number({ message: "最小长度必须是一个非负整数" }).int({ message: "最小长度必须是一个非负整数" }).min(0, { message: "最小长度必须是一个非负整数" }),
    z.undefined(),
    z
        .any()
        .refine(v => Number.isNaN(v), { message: "最小长度必须是一个非负整数" })
        .transform(v => undefined),
])
