import { v4 as uuidv4 } from 'uuid';
import accountRepository from '../../repositories/accountRepository';
import errorFactory from '../../utils/errors/errorFactory';
import { EMAIL_UNAVAILABLE_ERROR, USERNAME_UNAVAILABLE_ERROR } from '../../constants/auth/responseErrorConstants';

import { Account, SignupUserRequestBody } from '../../generated-api';
import accountHelper from './accountHelper';

async function createAccount(signupData: SignupUserRequestBody): Promise<Account | null> {
  const isUserNameAvailable = await accountHelper.checkIsUserNameAvailable(signupData.username);
  const isEmailAvailable = await accountHelper.checkIsEmailAvailable(signupData.email);

  if (!isUserNameAvailable) {
    throw errorFactory(USERNAME_UNAVAILABLE_ERROR);
  }
  if (!isEmailAvailable) {
    throw errorFactory(EMAIL_UNAVAILABLE_ERROR);
  }

  const userProfileId = uuidv4();
  const userId = uuidv4();

  const accountData: Account = {
    email: signupData.email,
    userId: userId,
    userName: signupData.username,
    profileId: userProfileId,
    firstName: signupData.firstName || null,
    lastName: signupData.lastName || null,
    profileImageUrl: 'InsertTempImageHere',
  };

  return await accountRepository.createAccount(accountData, signupData.password);
}

async function getAccountByEmail(email: string): Promise<Account> {
  const account = await accountRepository.getAccountByEmail(email);
  if (!account) {
    throw errorFactory({
      error: 'Account not found',
      message: 'Account not found',
      statusCode: 404,
      success: false,
    });
  }
  return account;
}

async function getAccountByUserId(userId: string): Promise<Account> {
  const account = await accountRepository.getAccountByUserId(userId);
  if (!account) {
    throw errorFactory({
      error: 'Account not found',
      message: 'Account not found',
      statusCode: 404,
      success: false,
    });
  }
  return account;
}

async function getAccountByProfileId(profileId: string): Promise<Account> {
  const account: Account | null = await accountRepository.getAccountByProfileId(profileId);
  if (!account) {
    throw errorFactory({
      error: 'Account not found',
      message: 'Account not found',
      statusCode: 404,
      success: false,
    });
  }
  return account;
}

const accountService = {
  createAccount,
  getAccountByEmail,
  getAccountByUserId,
  getAccountByProfileId,
};

export default accountService;
