import { UUID } from 'crypto';
import {
  Account,
  AccountRole,
  SignupUserRequestBody,
} from '../../generated-api';
import {
  BadRequestError,
  InternalServerError,
} from '../../utils/errors/errors';
import { validate } from 'uuid';
import logger from '../../config/logger';
import accountHelper from '../../helpers/auth/accountHelper';
import { v4 as uuidv4 } from 'uuid';
import { defaultProfileImagePath } from '../../constants/defaultImagePaths';
import accountRepository from '../../repositories/auth/accountRepository';
import { Transaction } from 'sequelize';
import userHelper from '../../helpers/auth/userHelper';

export type AccountIdentifierType =
  | 'email'
  | 'userName'
  | 'profileId'
  | 'userId';

const accountService = {
  createAccount,
  getAccount,
};

async function createAccount(
  signupData: SignupUserRequestBody
): Promise<Account> {
  await accountHelper.validateCreateAccountData(signupData);

  const userProfileId = uuidv4();
  const userId = uuidv4();

  const accountData: Account = {
    email: signupData.email,
    userId: userId,
    userName: signupData.username,
    profileId: userProfileId,
    firstName: signupData.firstName || null,
    lastName: signupData.lastName || null,
    accountRole: AccountRole.User,
  };

  const account: Account = await accountRepository.createAccount(
    accountData,
    signupData.password
  );

  return account;
}

async function getAccount(
  identifier: string | UUID,
  identifierType: AccountIdentifierType,
  transaction?: Transaction
): Promise<Account> {
  if (identifierType === 'email') {
    await userHelper.validateEmail(identifier);
  } else if (identifierType === 'userName') {
    await userHelper.validateUserNameAndExists(identifier);
  } else if (identifierType === 'profileId') {
    if (!validate(identifier)) {
      throw new BadRequestError('Invalid profileId');
    }
  } else if (identifierType === 'userId') {
    if (!validate(identifier)) {
      throw new BadRequestError('Invalid userId');
    }
  } else {
    logger.error('Invalid Identifier Type for getting Account');
    throw new InternalServerError();
  }

  const account: Account = await accountRepository.getAccount(
    identifier,
    identifierType,
    transaction
  );
  return account;
}

export default accountService;
