import { Transaction } from 'sequelize';
import { Account } from '../../generated-api';
import { PasswordAttributes } from '../../models/account/Password';
import passwordHelper from '../../helpers/auth/passwordHelper';
import {
  BadRequestError,
  InternalServerError,
} from '../../utils/errors/errors';
import accountRepository from '../../repositories/auth/accountRepository';
import logger from '../../config/logger';
import passwordRepository from '../../repositories/auth/passwordRepository';

const passwordService = { createPasswordForAccount };

async function createPasswordForAccount(
  account: Account,
  password: string,
  transaction?: Transaction
): Promise<PasswordAttributes> {
  try {
    // Verify password strength
    if (!passwordHelper.isPasswordStrong(password)) {
      throw new BadRequestError(
        'Weak Password: Must include 1 Uppercase character, 1 Lowercase character, 1 Number, and 1 Special character'
      );
    }

    const userExists = await accountRepository.getAccount(
      account.userId,
      'userId',
      transaction
    );
    if (!userExists) {
      logger.error(
        `Cannot create password: User with userId ${account.userId} not found`
      );
      throw new InternalServerError();
    }

    // Hash password
    const hashedPassword: string = await passwordHelper.getHashedPassword(
      password
    );

    // Create password record
    return await passwordRepository.createPassword(
      account.userId,
      'userId',
      hashedPassword,
      transaction
    );
  } catch (error) {
    logger.error(`Error creating password for account: ${error}`);
    throw error;
  }
}

export default passwordService;
