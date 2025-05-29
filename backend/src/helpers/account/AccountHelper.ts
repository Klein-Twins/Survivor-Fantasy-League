import validator from 'validator';
import { models } from '../../config/db';
import { BadRequestError } from '../../utils/errors/errors';
import { inject, injectable } from 'tsyringe';
import { PasswordHelper } from './PasswordHelper';
import { UUID } from 'crypto';

@injectable()
export class AccountHelper {
  constructor(@inject(PasswordHelper) private passwordHelper: PasswordHelper) {}

  /**
   * @param email The email to validate
   * @returns {Promise<boolean>} A promise that resolves to true if the email is available, false otherwise
   */
  async isEmailAvailable(email: string): Promise<boolean> {
    const isEmailTiedToAccount = await models.User.findOne({
      where: { email },
    }).then((user) => !!user);
    return !isEmailTiedToAccount;
  }

  /**
   * @param userName The username to validate
   * @returns {Promise<boolean>} A promise that resolves to true if the username is available, false otherwise
   */
  async isUserNameAvailable(userName: string): Promise<boolean> {
    const isUserNameTiedToAccount = await models.User.findOne({
      where: { userName },
    }).then((user) => !!user);
    return !isUserNameTiedToAccount;
  }

  async isUserIdAvailable(userId: UUID): Promise<boolean> {
    const isUserIdTiedToAccount = await models.User.findOne({
      where: { userId },
    }).then((user) => !!user);
    return !isUserIdTiedToAccount;
  }

  async isProfileIdAvailable(profileId: UUID): Promise<boolean> {
    const isProfileIdTiedToAccount = await models.Profile.findOne({
      where: { profileId },
    }).then((profile) => !!profile);
    return !isProfileIdTiedToAccount;
  }

  validateEmail(email: string): boolean {
    if (!email) {
      throw new BadRequestError('Email is required');
    }
    return validator.isEmail(email);
  }

  validatePassword(password: string): boolean {
    if (!password) {
      throw new BadRequestError('Password is required');
    }
    return this.passwordHelper.validatePasswordStrength(password);
  }

  validateUserName(userName: string): boolean {
    if (!userName) {
      throw new BadRequestError('Username is required');
    }
    return userName.length >= 7;
  }

  validateFirstName(firstName: string): boolean {
    if (!firstName) {
      throw new BadRequestError('First name is required');
    }
    return firstName.length >= 2;
  }

  validateLastName(lastName: string): boolean {
    if (!lastName) {
      throw new BadRequestError('Last name is required');
    }
    return lastName.length >= 2;
  }

  validateCreateAccountInput({
    email,
    password,
    userName,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    userName: string;
    firstName: string;
    lastName: string;
  }) {
    if (!this.validateEmail(email)) {
      throw new BadRequestError('Email is not valid');
    }
    if (!this.validatePassword(password)) {
      throw new BadRequestError('Password is not strong enough');
    }
    if (!this.validateUserName(userName)) {
      throw new BadRequestError('Username is not valid');
    }
    if (!this.validateFirstName(firstName)) {
      throw new BadRequestError('First name is not valid');
    }
    if (!this.validateLastName(lastName)) {
      throw new BadRequestError('Last name is not valid');
    }
  }
}
