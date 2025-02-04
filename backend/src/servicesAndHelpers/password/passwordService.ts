import { Transaction } from 'sequelize';
import { PasswordAttributes } from '../../models/account/Password';
import passwordRepository from '../../repositories/passwordRepository';
import passwordHelper from './passwordHelper';
import logger from '../../config/logger';
import { Account } from '../../generated-api';
import userRepository from '../../repositories/userRepository';
import { BadRequestError, InternalServerError } from '../../utils/errors/errors';

/**
 * Service functions related to password management, including creating passwords,
 * checking passwords, and ensuring password security.
 */

async function doesAccountPasswordMatch(account: Account, password: string): Promise<boolean> {
  // Retrieve the active password for the user
  const activePassword = await passwordRepository.getActivePasswordForUserId(account.userId);

  if (!activePassword) {
    logger.error(`No active password for user ${account.userId} found...`);
    throw new InternalServerError('Please reset your password');
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
      throw new BadRequestError(
        'Weak Password: Must include 1 Uppercase character, 1 Lowercase character, 1 Number, and 1 Special character'
      );
    }

    // Verify user exists
    const userExists = await userRepository.getUserByProfileId(account.profileId, transaction);
    if (!userExists) {
      logger.error(`User ${account.userId} not found when creating password`);
      throw new InternalServerError();
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
