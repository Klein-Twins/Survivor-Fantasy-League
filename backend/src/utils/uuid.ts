export function isValidUUIDv4(uuid: string): boolean {
    // UUID v4 regex pattern
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // Test the UUID string against the regex
    return uuidV4Regex.test(uuid);
}

// Usage example:
// const uuid = "b0d049c3-8b8f-4de6-bbb1-bab61e2e50f7";
// console.log(isValidUUIDv4(uuid)); // true