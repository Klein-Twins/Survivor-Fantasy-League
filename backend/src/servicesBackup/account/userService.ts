import { UUID } from 'crypto';
import { Account } from '../../generated-api';
import accountService from './accountService';
import passwordService from '../auth/passwordService';
import {
  NotFoundError,
  NotImplementedError,
  UnauthorizedError,
} from '../../utils/errors/errors';
import { UserAttributes } from '../../models/account/User';
import { PasswordAttributes } from '../../models/account/Password';
import { ProfileAttributes } from '../../models/account/Profile';

const userService = {
  login,
  signup,
  logout,
};

async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Account> {
  try {
    const account = await accountService.getAccount('email', email);
    if (
      !(await passwordService.authenticatePassword(
        account.userId as UUID,
        password
      ))
    ) {
      throw new UnauthorizedError('Invalid email or password');
    }
    return account;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError('Invalid email or password');
    }
    throw error;
  }
}

async function signup(signupData: {
  email: UserAttributes['email'];
  password: PasswordAttributes['password'];
  userName: UserAttributes['userName'];
  firstName: ProfileAttributes['firstName'];
  lastName: ProfileAttributes['lastName'];
}): Promise<Account> {
  return await accountService.createAccount(signupData);
}

async function logout() {
  throw new NotImplementedError('userService.logout() is not implemented');
}

export default userService;
