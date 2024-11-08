import errorFactory from "../../utils/errors/errorFactory";
import { LoginFields, SignupFields } from "../../types/auth/authTypes";

import passwordHelper from "../password/passwordHelper";

/**
 * Validates the request data for login.
 * This function checks if the `email` and `password` fields are present and valid.
 * 
 * @param {LoginFields} fields - The login request data that contains `email` and `password`.
 * 
 * @throws {Error} - Throws an error if the `email` or `password` fields are missing, empty, or invalid.
 * - Missing email will result in a `400` status code and an error message of `'Missing email'`.
 * - Invalid email format will result in a `400` status code and an error message of `'Invalid Email'`.
 * - Missing password will result in a `400` status code and an error message of `'Missing password'`.
 * 
 * @example
 * const loginData: LoginFields = { email: 'test@example.com', password: 'securePassword123' };
 * validateLoginRequestData(loginData); // Throws an error if any field is invalid.
 */
export const validateLoginRequestData = (fields: LoginFields) => {
    if (!fields.email || fields.email.length === 0) throw errorFactory({ message: 'Missing email', statusCode: 400 });
    if (!validateEmail(fields.email)) throw errorFactory({ message: 'Invalid Email', statusCode: 400 });
    if (!fields.password || fields.password.length === 0) throw errorFactory({ message: 'Missing password', statusCode: 400 })
}

/**
 * Validates the request data for signup.
 * This function checks if the `email`, `password`, `username`, `firstName`, and `lastName` fields are present, valid, and conform to expected formats.
 * Additionally, it ensures that the `password` meets strength requirements.
 * 
 * @param {SignupFields} fields - The signup request data that contains `email`, `username`, `password`, `firstName`, and `lastName`.
 * 
 * @throws {Error} - Throws an error if any of the following conditions are not met:
 * - Missing `email`, `password`, or `username` results in a `400` status code and respective error messages (`'Missing email'`, `'Missing password'`, `'Missing username'`).
 * - Invalid `firstName` or `lastName` (only letters and spaces allowed) results in a `400` status code and an error message of `'Invalid first name'` or `'Invalid last name'`.
 * - Invalid `email` format results in a `400` status code and an error message of `'Invalid email'`.
 * - Weak `password` (not strong enough) results in a `400` status code and an error message of `'Password is too weak'`.
 * 
 * @example
 * const signupData: SignupFields = { email: 'test@example.com', username: 'user123', password: 'Password123!', firstName: 'John', lastName: 'Doe' };
 * await validateSignupRequestData(signupData); // Throws an error if any field is invalid.
 */
export const validateSignupRequestData = ({ email, username, password, firstName, lastName }: SignupFields) => {
    if (!email || email.length === 0) throw errorFactory({ message: 'Missing email', statusCode: 400 });
    if (!password || password.length === 0) throw errorFactory({ message: 'Missing password', statusCode: 400 });
    if (!username || username.length === 0) throw errorFactory({ message: 'Missing username', statusCode: 400 });
    if (firstName && !isValidName(firstName)) throw errorFactory({ message: 'Invalid first name: only letters and spaces allowed', statusCode: 400 });
    if (lastName && !isValidName(lastName)) throw errorFactory({ message: 'Invalid last name: only letters and spaces allowed', statusCode: 400 });
    if (!validateEmail(email)) throw errorFactory({ message: 'Invalid email', statusCode: 400 });
    if (!passwordHelper.isPasswordStrong(password)) throw errorFactory({ message: 'Password is too weak', statusCode: 400 });
};

/**
 * Validates if a name is valid (only letters and spaces allowed).
 * This function checks that the provided name consists only of alphabetical characters and spaces.
 * 
 * @param {string} name - The name string to validate.
 * 
 * @returns {boolean} - `true` if the name is valid, otherwise `false`.
 * 
 * @example
 * const isValid = isValidName('John Doe');  // Returns true
 * const isValid = isValidName('John123');   // Returns false
 */
export function isValidName(name: string): boolean {
    // Regex to check if the name contains only letters (both upper and lower case), accented characters, and spaces in the middle
    const regex = /^(?!.*\s\s)[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/;
    return regex.test(name);
}

/**
 * Validates the given email address according to basic and extended email format rules.
 * The function checks for proper email structure, character validity, and domain rules.
 * 
 * ### Email Rules Checked:
 * - The email must have exactly one "@" symbol.
 * - The local part (before "@") may contain letters, numbers, periods, underscores, and special characters like "%", "+", and "-".
 * - The domain part (after "@") may contain letters, numbers, periods, and hyphens, but not underscores.
 * - Domain parts cannot start or end with a hyphen.
 * - Local part and domain cannot have consecutive dots.
 * - Local part and domain cannot start or end with a dot.
 * - The domain must have a valid structure, i.e., a valid top-level domain (TLD).
 * 
 * @param email - The email address to validate.
 * @returns `true` if the email is valid according to the rules, otherwise `false`.
 * 
 * @example
 * validateEmail('test@example.com'); // true
 * validateEmail('test@exam-ple.com'); // true
 * validateEmail('test@exam..com'); // false (multiple dots)
 * validateEmail('test@ex@ample.com'); // false (extra '@' symbol)
 * validateEmail('test@ex_ample.com'); // false (underscore in domain)
 * validateEmail('test@-example.com'); // false (domain starts with hyphen)
 */
export const validateEmail = (email: string): boolean => {
    // Basic email format check
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
        return false;
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
        return false;
    }

    // Ensure no underscores in the domain part
    if (/[^a-zA-Z0-9.-]/.test(domain)) {
        return false; // Underscore or invalid characters found in domain
    }

    // Ensure the domain does not start or end with a hyphen
    if (domain.startsWith('-') || domain.endsWith('-')) {
        return false;
    }

    // Ensure no part of the domain has a hyphen at the start or end
    const domainParts = domain.split('.');
    for (let part of domainParts) {
        if (part.startsWith('-') || part.endsWith('-')) {
            return false;
        }
    }

    return true;
};