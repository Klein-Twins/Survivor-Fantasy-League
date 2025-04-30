import bcrypt from 'bcrypt';
import { BadRequestError } from '../../utils/errors/errors';
import { injectable } from 'tsyringe';

@injectable()
export class PasswordHelper {
  /**
   * @param password The password to hash
   * @returns {Promise<string>} A promise that resolves to the hashed password
   * @throws {BadRequestError} If the password is not strong enough
   */
  async hashPassword(password: string): Promise<string> {
    if (!this.validatePasswordStrength(password)) {
      throw new BadRequestError('Password is not strong enough');
    }
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * @param password The password to check
   * @returns {Promise<boolean>} A promise that resolves to true if the password is strong enough, false otherwise
   */
  validatePasswordStrength(password: string): boolean {
    //Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
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
}
