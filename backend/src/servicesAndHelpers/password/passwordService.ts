import { PasswordAttributes } from '../../models/Password';
import { UserAttributes } from '../../models/User';
import passwordRepository from '../../repositories/passwordRepository';
import errorFactory from '../../utils/errors/errorFactory';
import passwordHelper from './passwordHelper';

/**
 * Service to handle password-related logic for user accounts.
 * 
 * This service includes functions for creating a hashed password, checking password strength,
 * and validating if the entered password matches the stored password.
 */
const passwordService = {
    /**
     * Creates a new password for the specified user, ensuring the password meets strength requirements.
     *
     * This method validates the password strength by calling `isPasswordStrong`. If the password is too weak,
     * an error is thrown. Then, the password is hashed using `getHashedPassword` and stored in the database 
     * using `passwordRepository.createPassword`.
     *
     * ### Parameters:
     * - `user`: The user object for which the password is being set.
     * - `password`: The plaintext password to be hashed and saved.
     *
     * ### Returns:
     * - A Promise that resolves to the created `PasswordAttributes` object, or `null` if the operation failed.
     * 
     * @param user - The user object that the password is being set for.
     * @param password - The plaintext password to be set.
     * @returns A Promise resolving to the created `PasswordAttributes` or `null` if an error occurs.
     * @throws Throws an error if the password is too weak (status code: 400).
     */
    createPassword: async (user: UserAttributes, password: string): Promise<PasswordAttributes | null> => {
        // Check if the provided password meets the strength requirements
        if (!passwordHelper.isPasswordStrong(password)) {
            throw errorFactory({ message: 'Password is too weak', statusCode: 400 });
        }

        // Hash the password using bcrypt
        const hashedPassword = await passwordHelper.getHashedPassword(password);

        // Store the hashed password in the repository
        return await passwordRepository.createPassword(user, hashedPassword);
    },

    /**
     * Compares the provided password with the stored password for the given user.
     *
     * This method retrieves the active password for the user from the repository and compares it with 
     * the provided plaintext password using `doPasswordsMatch`. If no active password is found, an error is thrown.
     *
     * ### Parameters:
     * - `user`: The user whose password is being checked.
     * - `password`: The plaintext password to be compared.
     *
     * ### Returns:
     * - A Promise that resolves to a boolean indicating whether the provided password matches the stored password.
     *   - `true` if the passwords match.
     *   - `false` if the passwords do not match.
     * 
     * @param user - The user whose password is being checked.
     * @param password - The plaintext password to check against the stored password.
     * @returns A Promise that resolves to a boolean indicating if the passwords match.
     * @throws Throws an error if no active password is found for the user (status code: 500).
     */
    checkPasswordAgainstUserPassword: async (user: UserAttributes, password: string): Promise<boolean> => {
        // Retrieve the active password for the user from the repository
        const activePassword = await passwordRepository.getActivePassword(user);

        // If no active password is found, throw an error prompting the user to reset their password
        if (!activePassword) {
            throw errorFactory({ message: 'Please reset your password', statusCode: 500 });
        }

        // Compare the provided password with the stored active password
        return await passwordHelper.doPasswordsMatch(password, activePassword.PASSWORD);
    }
};

export default passwordService;