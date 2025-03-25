export const itemKeyReg = /^$$-(\w+)-(\w+)-(\w+)$/

export function isItemKey(key: string) {
    return itemKeyReg.test(key)
}
