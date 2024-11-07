import bcrypt from 'bcrypt';

/**
 * A helper module to manage password-related functionality.
 *
 * This module provides utilities to hash passwords, check password strength,
 * and compare passwords securely. It uses `bcrypt` for hashing and comparison.
 */
const passwordHelper = {
    /**
     * Hashes the provided password using bcrypt with a salt of 10 rounds.
     *
     * The method first generates a salt and then hashes the password using bcrypt.
     * The resulting hash can then be stored in the database for secure password storage.
     *
     * ### Parameters:
     * - `password`: The plaintext password to be hashed.
     *
     * ### Returns:
     * - A Promise that resolves to the hashed password as a string.
     *
     * @param password - The plaintext password to hash.
     * @returns A Promise that resolves to the hashed password.
     */
    getHashedPassword: async (password: string): Promise<string> => {
        // Generate a salt with 10 rounds
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the generated salt
        return await bcrypt.hash(password, salt);
    },

    /**
     * Checks if the provided password meets the strength requirements.
     *
     * This method ensures that the password:
     * - Is at least 8 characters long.
     * - Contains at least one lowercase letter.
     * - Contains at least one uppercase letter.
     * - Contains at least one special character (e.g., !@#$%^&*).
     * - Does not contain spaces.
     *
     * ### Parameters:
     * - `password`: The password to be validated.
     *
     * ### Returns:
     * - A boolean indicating whether the password meets the strength criteria.
     *   - `true` if the password is strong.
     *   - `false` if the password does not meet the criteria.
     *
     * @param password - The password to validate.
     * @returns A boolean indicating if the password is strong.
     */
    isPasswordStrong: (password: string): boolean => {
        const minLength = 8;
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasSpaces = /\s/.test(password);

        // Return true if all conditions are met for a strong password
        return (
            password.length >= minLength &&
            hasLowercase &&
            hasUppercase &&
            hasSpecialChar &&
            !hasSpaces
        );
    },

    /**
     * Compares two passwords to check if they match.
     *
     * This method uses bcrypt's `compare` function to securely compare the two
     * passwords. One of the passwords is expected to be the hashed version
     * stored in the database, while the other is the plaintext password entered
     * by the user.
     *
     * ### Parameters:
     * - `password1`: The first password (usually the plaintext password).
     * - `password2`: The second password (usually the hashed password).
     *
     * ### Returns:
     * - A Promise that resolves to a boolean indicating whether the passwords match.
     *   - `true` if the passwords match.
     *   - `false` if the passwords do not match.
     *
     * @param password1 - The plaintext password entered by the user.
     * @param password2 - The hashed password stored in the database.
     * @returns A Promise that resolves to a boolean indicating if the passwords match.
     */
    doPasswordsMatch: async (password1: string, password2: string): Promise<boolean> => {
        return await bcrypt.compare(password1, password2);
    },
};

export default passwordHelper;