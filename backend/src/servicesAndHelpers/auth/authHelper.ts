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
function isValidName(name: string): boolean {
    // Regex to check if the name only contains letters (both upper and lower case) and spaces
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
}

/**
 * Validates the format of an email address.
 * This function checks if the provided email matches a standard email format (e.g., 'user@example.com').
 * 
 * @param {string} email - The email string to validate.
 * 
 * @returns {boolean} - `true` if the email is valid, otherwise `false`.
 * 
 * @example
 * const isValid = validateEmail('test@example.com'); // Returns true
 * const isValid = validateEmail('invalid-email');    // Returns false
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};