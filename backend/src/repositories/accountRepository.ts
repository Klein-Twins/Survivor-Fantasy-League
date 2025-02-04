import { models, sequelize } from '../config/db';
import logger from '../config/logger';
import { Account } from '../generated-api';
import { PasswordAttributes } from '../models/account/Password';
import { ProfileAttributes } from '../models/account/Profile';
import { UserAttributes } from '../models/account/User';
import passwordService from '../servicesAndHelpers/password/passwordService';
import { InternalServerError } from '../utils/errors/errors';

/**
 * Repository for managing account-related operations, including creating accounts
 * and retrieving accounts by email.
 */

async function getAccountByEmail(email: string): Promise<Account | null> {
  const userRecord: UserAttributes | null = await models.User.findOne({
    where: {
      email,
    },
  });
  if (!userRecord) {
    return null;
  }

  const profileRecord: ProfileAttributes | null = await models.Profile.findOne({
    where: {
      profileId: userRecord.profileId,
    },
  });
  if (!profileRecord) {
    return null;
  }

  return buildAccountFromUserAndProfileRecords(userRecord, profileRecord);
}

async function getAccountByUserName(userName: string): Promise<Account | null> {
  const userRecord: UserAttributes | null = await models.User.findOne({
    where: {
      userName,
    },
  });
  if (!userRecord) {
    return null;
  }

  const profileRecord: ProfileAttributes | null = await models.Profile.findOne({
    where: {
      profileId: userRecord.profileId,
    },
  });
  if (!profileRecord) {
    return null;
  }

  return buildAccountFromUserAndProfileRecords(userRecord, profileRecord);
}

async function getAccountByUserId(userId: string): Promise<Account | null> {
  const userRecord: UserAttributes | null = await models.User.findOne({
    where: {
      userId,
    },
  });
  if (!userRecord) {
    return null;
  }

  const profileRecord: ProfileAttributes | null = await models.Profile.findOne({
    where: {
      profileId: userRecord.profileId,
    },
  });
  if (!profileRecord) {
    return null;
  }

  return buildAccountFromUserAndProfileRecords(userRecord, profileRecord);
}

function buildAccountFromUserAndProfileRecords(userRecord: UserAttributes, profileRecord: ProfileAttributes): Account {
  return {
    email: userRecord.email,
    userId: userRecord.userId,
    userName: userRecord.userName,
    profileId: profileRecord.profileId,
    firstName: profileRecord.firstName || null,
    lastName: profileRecord.lastName || null,
    profileImageUrl: profileRecord.imageUrl || 'test',
  };
}

async function createAccount(accountData: Account, password: string): Promise<Account | null> {
  const transaction = await sequelize.transaction();

  try {
    const profileRecord: ProfileAttributes = await models.Profile.create(
      {
        profileId: accountData.profileId,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        imageUrl: accountData.profileImageUrl,
      },
      { transaction }
    );

    const userRecord: UserAttributes = await models.User.create(
      {
        userId: accountData.userId,
        userName: accountData.userName,
        email: accountData.email,
        profileId: accountData.profileId,
      },
      { transaction }
    );

    const passwordRecord: PasswordAttributes | null = await passwordService.createPasswordForAccount(
      accountData,
      password,
      transaction
    );
    if (!passwordRecord) {
      throw new InternalServerError();
    }

    await transaction.commit();
    logger.debug('Transaction committed. Account created in DB');
    return buildAccountFromUserAndProfileRecords(userRecord, profileRecord);
  } catch (error) {
    await transaction.rollback();
    logger.error(`Transaction rolledback. Error creating and persisting account into DB: ${error}`);
    throw error;
  }
}

async function getAccountByProfileId(profileId: string): Promise<Account | null> {
  const userRecord: UserAttributes | null = await models.User.findOne({
    where: {
      profileId,
    },
  });
  if (!userRecord) {
    return null;
  }

  const profileRecord: ProfileAttributes | null = await models.Profile.findOne({
    where: {
      profileId,
    },
  });
  if (!profileRecord) {
    return null;
  }

  return buildAccountFromUserAndProfileRecords(userRecord, profileRecord);
}

/*
const accountRepository = {
    createAccount: async (inputAccountData: AccountAndPassword): Promise<{ profileRecord: ProfileAttributes, userRecord: UserAttributes, passwordRecord: PasswordAttributes }> => {
        const transaction = await sequelize.transaction();
        logger.debug("Transaction Created.");
        try {
            const profileRecord: ProfileAttributes = await profileService.createProfileForAccount(inputAccountData, transaction)
            const userRecord: UserAttributes = await userService.createUserForAccount(inputAccountData, transaction);
            const passwordRecord: PasswordAttributes = await passwordService.createPasswordForAccount(inputAccountData, transaction)

            await transaction.commit();
            logger.debug("Transaction committed. Account created in DB");

            return { profileRecord, passwordRecord, userRecord };
        } catch (error) {
            await transaction.rollback();
            logger.error(`Transaction rolledback. Error creating and persisting account into DB: ${error}`)
            throw error;
        }
    },

    getAccount: async ({ email, profileId }: { email?: UserAttributes["email"], profileId?: UserAttributes["profileId"] }): Promise<UserIncludeProfile | null> => {
        try {
            const whereClause: Partial<{ email: string; profileId: string }> = {};
            if (email !== undefined) whereClause.email = email;
            if (profileId !== undefined) whereClause.profileId = profileId;

            const userAndProfileRecord = await models.User.findOne({
                include: {
                    model: models.Profile,
                    as: 'profile',
                    required: true,
                },
                where: whereClause,
            }) as unknown as UserIncludeProfile;

            if (!userAndProfileRecord) {
                return null;
            }

            return userAndProfileRecord;
        } catch (error) {
            logger.error(`Error getting account for email ${email}: ${error}`);
            throw error;
        }
    }
}
*/

const accountRepository = {
  getAccountByUserName,
  getAccountByEmail,
  getAccountByUserId,
  getAccountByProfileId,
  createAccount,
};

export default accountRepository;
