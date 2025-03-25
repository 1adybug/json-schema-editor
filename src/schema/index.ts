import { z } from "zod"

interface SafeParseResult<T> {
    data?: T | undefined
    error?: z.ZodError | null
}

interface Schema<T> {
    safeParse: (arg: unknown) => SafeParseResult<T>
}

export function getValidate<T>(schema: z.ZodType<T>) {
    return function validate(arg: unknown): string | string[] | null {
        const { data, error } = schema.safeParse(arg)
        if (error) return error.errors.map(e => e.message)
        return null
    }
}
