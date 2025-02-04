import { Transaction } from 'sequelize';
import { PasswordAttributes } from '../../models/account/Password';
import { UserAttributes } from '../../models/account/User';
import passwordRepository from '../../repositories/passwordRepository';
import errorFactory from '../../utils/errors/errorFactory';
import passwordHelper from './passwordHelper';
import logger from '../../config/logger';
import {
  INTERNAL_SERVER_ERROR,
  PLEASE_RESET_PASSWORD_ERROR,
  WEAK_PASSWORD_ERROR,
} from '../../constants/auth/responseErrorConstants';
import { AccountAndPassword } from '../../types/auth/authTypes';
import { Account } from '../../generated-api';
import { models } from '../../config/db';
import userService from '../user/userService';
import userRepository from '../../repositories/userRepository';

/**
 * Service functions related to password management, including creating passwords,
 * checking passwords, and ensuring password security.
 */

async function doesAccountPasswordMatch(account: Account, password: string): Promise<boolean> {
  // Retrieve the active password for the user
  const activePassword = await passwordRepository.getActivePasswordForUserId(account.userId);

  if (!activePassword) {
    logger.error(`No active password for user ${account.userId} found...`);
    throw errorFactory(PLEASE_RESET_PASSWORD_ERROR);
  }

  // Compare the provided password with the stored password
  const doPasswordsMatch: boolean = await passwordHelper.doPasswordsMatch(password, activePassword.password);
  return doPasswordsMatch;
}

async function createPasswordForAccount(
  account: Account,
  password: string,
  transaction?: Transaction
): Promise<PasswordAttributes | null> {
  try {
    // Verify password strength
    if (!passwordHelper.isPasswordStrong(password)) {
      logger.error('Password is not strong enough');
      throw errorFactory(WEAK_PASSWORD_ERROR);
    }

    // Verify user exists
    const userExists = await userRepository.getUserByProfileId(account.profileId, transaction);
    if (!userExists) {
      logger.error(`User ${account.userId} not found when creating password`);
      throw errorFactory(INTERNAL_SERVER_ERROR);
    }

    // Hash password
    const hashedPassword: string = await passwordHelper.getHashedPassword(password);

    // Create password record
    return await passwordRepository.createPasswordRecordForUserId(account.userId, hashedPassword, transaction);
  } catch (error) {
    logger.error(`Error creating password for account: ${error}`);
    throw error;
  }
}

const passwordService = {
  doesAccountPasswordMatch,
  createPasswordForAccount,
};

// const passwordService = {

//     checkPasswordAgainstUserPassword: async (
//         user: UserAttributes,
//         password: string
//     ): Promise<boolean> => {
//         // Retrieve the active password for the user
//         const activePassword = await passwordRepository.getActivePasswordForUserId(user.userId);

//         if (!activePassword) {
//             logger.error(`No active password for user ${user.userId} found...`);
//             throw errorFactory(PLEASE_RESET_PASSWORD_ERROR);
//         }

//         // Compare the provided password with the stored password
//         return await passwordHelper.doPasswordsMatch(password, activePassword.password);
//     }
// };

export default passwordService;
