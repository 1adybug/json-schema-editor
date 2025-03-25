import { TypeEnum } from "../schema/typeEnum"

export const SchemaNameMap: Record<TypeEnum, string> = {
    object: "对象",
    array: "数组",
    string: "字符串",
    number: "数字",
    boolean: "布尔值",
    null: "空",
}

export const isDevelopment = process.env.NODE_ENV === "development"

export const isProduction = process.env.NODE_ENV === "production"
