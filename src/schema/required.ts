import { z } from "zod"

export const requiredSchema = z.union([z.enum(["true", "false"]).transform(value => value === "true"), z.boolean()]).optional()
