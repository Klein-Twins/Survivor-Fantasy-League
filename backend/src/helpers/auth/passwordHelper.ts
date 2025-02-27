import bcrypt from 'bcrypt';
import { BadRequestError } from '../../utils/errors/errors';

/**
 * Helper functions for working with passwords.
 * Includes password hashing, validation, and comparison.
 */
const passwordHelper = {
  getHashedPassword,
  isPasswordStrong,
  doPasswordsMatch,
  validatePassword,
};

function validatePassword(password: string): void {
  if (!isPasswordStrong(password)) {
    throw new BadRequestError('Password does not meet strength requirements');
  }
  if (!password || password.length === 0) {
    throw new BadRequestError('Missing password');
  }
}

/**
 * Hashes a plain-text password using bcrypt.
 *
 * @param password - The plain-text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
async function getHashedPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Checks if a given password meets the strength requirements.
 *
 * Password is considered strong if it meets the following criteria:
 * - At least 8 characters long
 * - Contains at least one lowercase letter
 * - Contains at least one uppercase letter
 * - Contains at least one special character
 * - Does not contain spaces
 *
 * @param password - The password to check for strength.
 * @returns `true` if the password is strong, otherwise `false`.
 */
function isPasswordStrong(password: string): boolean {
  const minLength = 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasSpaces = /\s/.test(password);

  return (
    password != undefined &&
    password.length >= minLength &&
    hasLowercase &&
    hasUppercase &&
    hasSpecialChar &&
    !hasSpaces
  );
}
/**
 * Compares two passwords to check if they match.
 *
 * @param password1 - The first password to compare.
 * @param password2 - The second password to compare.
 * @returns A promise that resolves to `true` if the passwords match, otherwise `false`.
 */
async function doPasswordsMatch(
  password1: string,
  password2: string
): Promise<boolean> {
  return await bcrypt.compare(password1, password2);
}

export default passwordHelper;
