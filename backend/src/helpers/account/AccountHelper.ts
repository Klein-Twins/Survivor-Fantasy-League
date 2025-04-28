import validator from 'validator';
import { models } from '../../config/db';
import { BadRequestError } from '../../utils/errors/errors';

export class AccountHelper {
  /**
   * @param email The email to validate
   * @returns {Promise<boolean>} A promise that resolves to true if the email is available, false otherwise
   */
  static async isEmailAvailable(email: string): Promise<boolean> {
    const isEmailTiedToAccount = await models.User.findOne({
      where: { email },
    }).then((user) => !!user);
    return !isEmailTiedToAccount;
  }

  /**
   * @param userName The username to validate
   * @returns {Promise<boolean>} A promise that resolves to true if the username is available, false otherwise
   */
  static async isUserNameAvailable(userName: string): Promise<boolean> {
    const isUserNameTiedToAccount = await models.User.findOne({
      where: { userName },
    }).then((user) => !!user);
    return !isUserNameTiedToAccount;
  }
}
