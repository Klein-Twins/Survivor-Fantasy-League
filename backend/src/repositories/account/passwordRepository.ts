import { Transaction } from 'sequelize';
import { PasswordAttributes } from '../../models/account/Password';
import sequelize, { models } from '../../config/db';

const passwordRepository = {
  createPassword,
  getActivePassword,
};

async function getActivePassword(
  userId: PasswordAttributes['userId']
): Promise<PasswordAttributes | null> {
  const activePassword = await models.Password.findAll({
    where: {
      userId,
      active: true,
    },
    order: [['passwordSed', 'DESC']],
  });

  if (activePassword.length === 0) {
    return null;
  }

  return activePassword[0];
}

async function createPassword(
  userId: PasswordAttributes['userId'],
  hashedPassword: PasswordAttributes['password'],
  transaction?: Transaction
): Promise<PasswordAttributes> {
  let t = transaction;
  if (!t) {
    t = await sequelize.transaction();
  }
  try {
    const maxPasswordSeqResult = await getMaxPasswordSeq(userId);
    const newPasswordSeq = maxPasswordSeqResult + 1;
    await setAllPasswordsToInactive(userId, transaction);

    const newPasswordRecord = await models.Password.create(
      {
        userId,
        password: hashedPassword,
        active: true,
        passwordSeq: newPasswordSeq,
      },
      { transaction }
    );

    if (!transaction && t) {
      await t.commit();
    }
    return newPasswordRecord;
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

async function setAllPasswordsToInactive(
  userId: PasswordAttributes['userId'],
  transaction?: Transaction
): Promise<void> {
  let t = transaction;
  if (!t) {
    t = await sequelize.transaction();
  }
  try {
    const numUpdated = await models.Password.update(
      { active: false },
      {
        where: {
          userId,
          active: true,
        },
      }
    );
    if (!transaction && t) {
      await t.commit();
    }
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

async function getMaxPasswordSeq(userId: PasswordAttributes['userId']) {
  const maxSeq: PasswordAttributes['passwordSeq'] =
    (await models.Password.max('passwordSeq', {
      where: { userId },
    })) || 0;
  return maxSeq;
}

export default passwordRepository;
