export function isValidName(name: string): boolean {
    // Regex to check if the name only contains letters (both upper and lower case) and spaces
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
}
