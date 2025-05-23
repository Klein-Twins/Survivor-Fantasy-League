import { Transaction } from 'sequelize';
import sequelize from '../../config/db';
import { Account, AccountRole } from '../../generated-api';
import accountHelper from '../../helpers/auth/accountHelper';
import { UserAttributes } from '../../models/account/User';
import profileRepository from '../../repositoriesBackup/account/profileRepository';
import userRepository from '../../repositoriesBackup/account/userRepository';
import passwordService from '../auth/passwordService';
import { ConflictError, NotFoundError } from '../../utils/errors/errors';
import logger from '../../config/logger';
import { ProfileAttributes } from '../../models/account/Profile';
import { PasswordAttributes } from '../../models/account/Password';
const accountService = {
  createAccount,
  getAccount,
};

async function createAccount(signupData: {
  email: UserAttributes['email'];
  userName: UserAttributes['userName'];
  firstName: ProfileAttributes['firstName'];
  lastName: ProfileAttributes['lastName'];
  password: PasswordAttributes['password'];
  userRole?: AccountRole;
  profileId?: ProfileAttributes['profileId'];
  userId?: UserAttributes['userId'];
}): Promise<Account> {
  const formattedSignupData = accountHelper.validate.createAccount(signupData);

  const isEmailAvailable = await accountHelper.isEmailAvailable(
    formattedSignupData.email
  );
  logger.debug(`isEmailAvailable: ${isEmailAvailable}`);
  if (!isEmailAvailable) {
    throw new ConflictError('Email is already taken');
  }
  const isUserNameAvailable = await accountHelper.isUserNameAvailable(
    formattedSignupData.userName
  );
  logger.debug(`isUserNameAvailable: ${isUserNameAvailable}`);
  if (!isUserNameAvailable) {
    throw new ConflictError('UserName is already taken');
  }

  const transaction = await sequelize.transaction();
  try {
    const profileAttributes = await profileRepository.createProfile(
      formattedSignupData.firstName,
      formattedSignupData.lastName,
      transaction,
      signupData.profileId
    );
    const userAttributes = await userRepository.createUser(
      formattedSignupData.userName,
      formattedSignupData.email,
      profileAttributes.profileId,
      AccountRole.User,
      transaction,
      signupData.userId
    );

    await passwordService.createPassword(
      userAttributes.userId,
      formattedSignupData.password,
      transaction
    );

    await transaction.commit();
    return buildAccount(userAttributes, profileAttributes);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
async function getAccount(
  field:
    | keyof Pick<UserAttributes, 'userId' | 'userName' | 'email' | 'profileId'>
    | 'leagueProfileId',
  value: string,
  t?: Transaction
): Promise<Account> {
  const userAttributes = await userRepository.getUserByField(field, value, t);
  if (!userAttributes) {
    throw new NotFoundError(`User with ${field}=${value} not found`);
  }

  const profileAttributes = await profileRepository.getProfile(
    userAttributes.profileId,
    t
  );
  if (!profileAttributes) {
    logger.error(`ProfileId not found for ${field}: `, value);
    throw new NotFoundError('ProfileId not found');
  }

  return buildAccount(userAttributes, profileAttributes);
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
    accountRole: userAttributes.userRole || AccountRole.User,
  };

  return account;
}

export default accountService;
