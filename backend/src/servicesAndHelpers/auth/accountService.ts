import { v4 as uuidv4 } from 'uuid';
import accountRepository from '../../repositories/accountRepository';
import { Account, SignupUserRequestBody } from '../../generated-api';
import accountHelper from './accountHelper';
import { ConflictError, NotFoundError } from '../../utils/errors/errors';

async function createAccount(signupData: SignupUserRequestBody): Promise<Account | null> {
  const isUserNameAvailable = await accountHelper.checkIsUserNameAvailable(signupData.username);
  const isEmailAvailable = await accountHelper.checkIsEmailAvailable(signupData.email);

  if (!isUserNameAvailable) {
    throw new ConflictError('Username is already taken');
  }
  if (!isEmailAvailable) {
    throw new ConflictError('Email is already tied to an account');
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
    throw new NotFoundError('Account not found');
  }
  return account;
}

async function getAccountByUserId(userId: string): Promise<Account> {
  const account = await accountRepository.getAccountByUserId(userId);
  if (!account) {
    throw new NotFoundError('Account not found');
  }
  return account;
}

async function getAccountByProfileId(profileId: string): Promise<Account> {
  const account: Account | null = await accountRepository.getAccountByProfileId(profileId);
  if (!account) {
    throw new NotFoundError('Account not found');
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
