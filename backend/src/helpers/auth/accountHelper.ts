import { PasswordAttributes } from '../../models/account/Password';
import { ProfileAttributes } from '../../models/account/Profile';
import { UserAttributes } from '../../models/account/User';
import userRepository from '../../repositoriesBackup/account/userRepository';
import { BadRequestError } from '../../utils/errors/errors';
import validator from 'validator';
import passwordHelper from './passwordHelper';
import logger from '../../config/logger';

async function isUserNameAvailable(
  userName: UserAttributes['userName']
): Promise<boolean> {
  const foundUser = await userRepository.getUserByField('userName', userName);
  return foundUser === null ? true : false;
}

async function isEmailAvailable(
  email: UserAttributes['email']
): Promise<boolean> {
  const foundUser = await userRepository.getUserByField('email', email);
  return foundUser === null ? true : false;
}

const validate = {
  createAccount: ({
    email,
    userName,
    firstName,
    lastName,
    password,
  }: {
    email: UserAttributes['email'];
    userName: UserAttributes['userName'];
    firstName: ProfileAttributes['firstName'];
    lastName: ProfileAttributes['lastName'];
    password: PasswordAttributes['password'];
  }): {
    email: UserAttributes['email'];
    userName: UserAttributes['userName'];
    firstName: ProfileAttributes['firstName'];
    lastName: ProfileAttributes['lastName'];
    password: PasswordAttributes['password'];
  } => {
    if (!email) {
      throw new BadRequestError('Missing email');
    }
    if (!userName) {
      throw new BadRequestError('Missing username');
    }
    if (!password) {
      throw new BadRequestError('Missing password');
    }

    email = email.trim();
    if (!validator.isEmail(email)) {
      throw new BadRequestError('Invalid email');
    }

    userName = userName.trim();
    if (!validator.isAlphanumeric(userName)) {
      throw new BadRequestError('Invalid username');
    }

    if (firstName) {
      firstName = firstName.trim();
      if (!validator.isAlpha(firstName)) {
        throw new BadRequestError('Invalid first name - must be alpha only');
      }
    }

    if (lastName) {
      lastName = lastName.trim();
      if (!validator.isAlpha(lastName)) {
        throw new BadRequestError('Invalid last name - must be alpha only');
      }
    }

    if (!passwordHelper.isPasswordStrong(password)) {
      throw new BadRequestError('Password is not strong enough');
    }

    return {
      email,
      userName,
      firstName,
      lastName,
      password,
    };
  },
};

const accountHelper = {
  isUserNameAvailable,
  isEmailAvailable,
  validate,
};
export default accountHelper;
