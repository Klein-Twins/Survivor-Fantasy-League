import { Transaction } from 'sequelize';
import { Account, AccountRole } from '../../generated-api';
import { AccountIdentifierType } from '../../services/auth/accountService';
import { models, sequelize } from '../../config/db';
import { ProfileAttributes } from '../../models/account/Profile';
import { UserAttributes } from '../../models/account/User';
import logger from '../../config/logger';
import { NotFoundError } from '../../utils/errors/errors';
import accountHelper from '../../helpers/auth/accountHelper';
import { PasswordAttributes } from '../../models/account/Password';
import passwordService from '../../services/auth/passwordService';

const accountRepository = {
  getAccount,
  createAccount,
};

async function getAccount(
  identifier:
    | UserAttributes['email']
    | UserAttributes['userName']
    | UserAttributes['userId']
    | ProfileAttributes['profileId'],
  identifierType: AccountIdentifierType,
  transaction?: Transaction
): Promise<Account> {
  let userRecord: UserAttributes | null;
  switch (identifierType) {
    case 'email':
      userRecord = await models.User.findOne({
        where: {
          email: identifier,
        },
        transaction,
      });
      break;
    case 'userName':
      userRecord = await models.User.findOne({
        where: {
          userName: identifier,
        },
        transaction,
      });
      break;
    case 'userId':
      userRecord = await models.User.findOne({
        where: {
          userId: identifier,
        },
        transaction,
      });
      break;
    case 'profileId':
      userRecord = await models.User.findOne({
        where: {
          profileId: identifier,
        },
        transaction,
      });
      break;
    default:
      throw new Error('Invalid identifier type');
  }

  if (!userRecord) {
    throw new NotFoundError(
      `Account not found with ${identifierType}: ${identifier}`
    );
  }

  const profileRecord: ProfileAttributes | null = await models.Profile.findOne({
    where: {
      profileId: userRecord.profileId,
    },
  });

  if (!profileRecord) {
    throw new NotFoundError(`Profile not found for user ${userRecord.userId}`);
  }

  return accountHelper.buildAccount(userRecord, profileRecord);
}

async function createAccount(
  accountData: Account,
  password: PasswordAttributes['password'],
  transaction?: Transaction
): Promise<Account> {
  let t = transaction;
  if (!transaction) {
    t = await sequelize.transaction();
  }

  try {
    const profileRecord: ProfileAttributes = await models.Profile.create(
      {
        profileId: accountData.profileId,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
      },
      { transaction }
    );

    const userRecord: UserAttributes = await models.User.create(
      {
        userId: accountData.userId,
        userName: accountData.userName,
        email: accountData.email,
        profileId: accountData.profileId,
        userRole: AccountRole.User,
      },
      { transaction }
    );

    await passwordService.createPasswordForAccount(
      accountData,
      password,
      transaction
    );

    if (!transaction && t) {
      await t.commit();
    }

    return accountHelper.buildAccount(userRecord, profileRecord);
  } catch (error) {
    logger.error(`Error creating account: ${error}`);
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

export default accountRepository;
