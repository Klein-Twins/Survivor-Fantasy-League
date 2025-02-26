import { validate } from 'uuid';
import {
  Account,
  AccountUserRoleEnum,
  SignupUserRequestBody,
} from '../../generated-api';
import accountRepository from '../../repositories/auth/accountRepository';
import {
  BadRequestError,
  ConflictError,
  CustomError,
  NotFoundError,
} from '../../utils/errors/errors';
import userHelper from './userHelper';
import passwordHelper from './passwordHelper';
import { UserAttributes } from '../../models/account/User';
import { ProfileAttributes } from '../../models/account/Profile';

const accountHelper = {
  validateCreateAccountData,
  validateProfileId,
  //TODO: Reorganize USR_USERS and PRF_PROFILE tables such that userName
  buildAccount,
};

async function validateProfileId(profileId: string): Promise<void> {
  if (!validate(profileId)) {
    throw new BadRequestError('Invalid profileId');
  }
}

async function isAccountAvailable(
  username: string,
  email: string
): Promise<void> {
  try {
    if (!(await checkIsEmailAvailable(email))) {
      throw new ConflictError('Email already belongs to a torch bearer.');
    }
    if (!(await checkIsUserNameAvailable(username))) {
      throw new ConflictError('Username already belongs to a torch bearer.');
    }
  } catch (err: any) {
    console.log(err);
    throw err;
  }
}

async function checkIsUserNameAvailable(userName: string): Promise<boolean> {
  try {
    const account: Account | null = await accountRepository.getAccount(
      userName,
      'userName'
    );
    return false;
  } catch (err: any) {
    if (err instanceof CustomError) {
      return true;
    }
    throw err;
  }
}
async function checkIsEmailAvailable(email: string): Promise<boolean> {
  try {
    const account: Account | null = await accountRepository.getAccount(
      email,
      'email'
    );
    return false;
  } catch (err: any) {
    if (err instanceof NotFoundError || err instanceof CustomError) {
      return true;
    }
    throw err;
  }
}

async function validateCreateAccountData(
  signupData: SignupUserRequestBody
): Promise<void> {
  await userHelper.validateEmail(signupData.email);
  await userHelper.validateUserNameAndExists(signupData.username);
  passwordHelper.validatePassword(signupData.password);

  await isAccountAvailable(signupData.username, signupData.email);
  return;
}

function buildAccount(
  userAttributes: UserAttributes,
  ProfileAttributes: ProfileAttributes
): Account {
  if (userAttributes.profileId !== ProfileAttributes.profileId) {
    throw new Error(
      'Cannot build account object: profileId mismatch between userAttributes and profileAttributes'
    );
  }

  const account: Account = {
    email: userAttributes.email,
    userId: userAttributes.userId,
    userName: userAttributes.userName,
    profileId: userAttributes.profileId,
    firstName: ProfileAttributes.firstName || null,
    lastName: ProfileAttributes.lastName || null,
    profileImageUrl: ProfileAttributes.imageUrl,
    userRole: userAttributes.userRole || AccountUserRoleEnum.USER,
  };

  return account;
}

export default accountHelper;
