/**
 * Validates a name string. The name should contain only letters (both uppercase and lowercase),
 * accented characters, and spaces in between words.
 * 
 * @param name - The name string to validate.
 * @returns True if the name is valid, otherwise false.
 */
export function isValidName(name: string): boolean {
    // Regex to check if the name contains only letters (both upper and lower case), accented characters, and spaces in between words.
    const regex = /^(?!.*\s\s)[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/;
    return regex.test(name);
}

/**
 * Validates a username string. The username should only contain letters (both uppercase and lowercase)
 * and numbers.
 * 
 * @param username - The username string to validate.
 * @returns True if the username is valid, otherwise false.
 */
export function isValidUsername(username: string): boolean {
    // Regex matches only letters (uppercase and lowercase) and numbers
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(username);
}

/**
 * Validates an email string. It checks the structure of the email and ensures that it conforms to the
 * standard email format, with additional checks for local part and domain validity.
 * 
 * @param email - The email string to validate.
 * @returns True if the email is valid, otherwise false.
 */
export const isValidEmail = (email: string): boolean => {
    // Basic email format check using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Ensure the email passes the basic structure validation
    if (!emailRegex.test(email)) return false;

    // Split the email into local part and domain
    const [localPart, domain] = email.split('@');

    // Check for extra '@' symbol
    if (email.split('@').length !== 2) {
        return false; // Extra '@' detected
    }

    // Check if local part has invalid characters (like '#')
    if (/[^a-zA-Z0-9._%+-]/.test(localPart)) {
        return false; // Invalid characters in local part
    }

    // Ensure no dots before '@', multiple consecutive dots, or at the beginning or end
    if (
        localPart.startsWith('.') ||
        domain.startsWith('.') ||
        localPart.endsWith('.') ||
        domain.endsWith('.') ||
        localPart.includes('..') ||
        domain.includes('..')
    ) {
        return false; // Invalid dot placement
    }

    // Ensure no underscores in the domain part
    if (/[^a-zA-Z0-9.-]/.test(domain)) {
        return false; // Underscore or invalid characters found in domain
    }

    // Ensure the domain does not start or end with a hyphen
    if (domain.startsWith('-') || domain.endsWith('-')) {
        return false; // Hyphen at the start or end of domain
    }

    // Ensure no part of the domain has a hyphen at the start or end
    const domainParts = domain.split('.');
    for (let part of domainParts) {
        if (part.startsWith('-') || part.endsWith('-')) {
            return false; // Hyphen at the start or end of domain part
        }
    }

    return true;
};