import bcrypt from 'bcrypt';
import { BadRequestError } from '../../utils/errors/errors';

export class PasswordHelper {
  /**
   * @param password The password to hash
   * @returns {Promise<string>} A promise that resolves to the hashed password
   * @throws {BadRequestError} If the password is not strong enough
   */
  static async hashPassword(password: string): Promise<string> {
    await this.checkPasswordStrength(password);
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * @param password The password to check
   * @returns {Promise<void>} A promise that resolves if the password is strong enough, or rejects with an error message
   * @throws {BadRequestError} If the password is not strong enough
   */
  private static async checkPasswordStrength(password: string): Promise<void> {
    //Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new BadRequestError(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
    }
  }
}
