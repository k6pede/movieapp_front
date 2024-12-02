export function stringifyValues<T extends Record<string, unknown>>(obj: T) {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key,
            value ? value.toString() : '',
        ]),
    ) as { [K in keyof T]: string}
}