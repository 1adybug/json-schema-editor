import { createPersistentStore } from "react-soda"

import { JsonSchema, typeSchema } from "../schema/type"

export const useSchemas = createPersistentStore<JsonSchema[]>([], {
    name: "schemas",
    parse(str) {
        const result = JSON.parse(str)
        if (!Array.isArray(result)) return []
        return result.map(item => typeSchema.safeParse(item).data).filter(item => !!item)
    },
})
