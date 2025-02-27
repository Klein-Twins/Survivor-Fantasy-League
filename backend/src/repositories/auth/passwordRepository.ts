import { Transaction } from 'sequelize';
import accountService, {
  AccountIdentifierType,
} from '../../services/auth/accountService';
import { PasswordAttributes } from '../../models/account/Password';
import { models, sequelize } from '../../config/db';
import { Account } from '../../generated-api';
import { UserAttributes } from '../../models/account/User';
import logger from '../../config/logger';

const passwordRepository = {
  createPassword,
};

async function createPassword(
  identifier: string,
  identifierType: AccountIdentifierType,
  hashedPassword: PasswordAttributes['password'],
  transaction?: Transaction
): Promise<PasswordAttributes> {
  if (!transaction) {
    transaction = await sequelize.transaction();
  }
  try {
    let userId = null;
    if (identifierType !== 'userId') {
      const account: Account = await accountService.getAccount(
        identifier,
        identifierType,
        transaction
      );
      userId = account.userId;
    } else {
      userId = identifier;
    }

    const maxPasswordSeqResult = await models.Password.max('passwordSeq', {
      where: { userId },
    });
    const newPasswordSeq: number =
      (typeof maxPasswordSeqResult === 'number' ? maxPasswordSeqResult : 0) + 1;

    await setAllPasswordsForUserIdToInactive(userId, transaction);

    const newPasswordRecord = await models.Password.create(
      {
        userId,
        password: hashedPassword,
        active: true,
        passwordSeq: newPasswordSeq,
      },
      { transaction }
    );

    return newPasswordRecord;
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error creating password for account: ${error}`);
    throw error;
  }
}

async function setAllPasswordsForUserIdToInactive(
  userId: UserAttributes['userId'],
  transaction?: Transaction
): Promise<void> {
  if (!transaction) {
    transaction = await sequelize.transaction();
  }

  try {
    await models.Password.update(
      { active: false },
      {
        where: {
          userId: userId,
          active: true,
        },
        transaction,
      }
    );
  } catch (error) {
    await transaction.rollback();
    logger.error(
      `Failed to set all passwords to inactive for user with userId ${userId}: ${error}`
    );
    throw error;
  }
}

export default passwordRepository;
