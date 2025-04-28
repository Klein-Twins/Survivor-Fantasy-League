import { Transaction } from 'sequelize';
import { PasswordAttributes } from '../../models/account/Password';
import { UserAttributes } from '../../models/account/User';
import { models } from '../../config/db';
import { PasswordHelper } from '../../helpers/account/PasswordHelper';

export class PasswordRepository {
  constructor() {}

  static async getActivePassword(
    userId: UserAttributes['userId']
  ): Promise<PasswordAttributes['password']> {
    const activePasswordData = await models.Password.findOne({
      where: { userId, active: true },
    });
    if (!activePasswordData) {
      throw new Error('No active password found for the user');
    }
    return activePasswordData.password;
  }

  static async saveNewPassword(
    {
      password,
      userId,
    }: {
      password: PasswordAttributes['password'];
      userId: UserAttributes['userId'];
    },
    transaction: Transaction
  ) {
    const hashedPassword: string = await PasswordHelper.hashPassword(password);

    const passwordHistoryData = await this.findUserPasswordHistory(
      userId,
      transaction
    );

    if (passwordHistoryData.length > 0) {
      await this.disableUserPasswords(userId, transaction);
    }

    const passwordSequence = await this.getNextPasswordSequence(
      userId,
      transaction
    );

    await models.Password.create(
      {
        password: hashedPassword,
        userId,
        passwordSeq: passwordSequence,
        active: true,
      },
      { transaction }
    );
  }

  private static async findUserPasswordHistory(
    userId: UserAttributes['userId'],
    transaction?: Transaction
  ): Promise<PasswordAttributes[]> {
    const passwordHistoryData = await models.Password.findAll({
      where: { userId },
      transaction: transaction,
    });
    return passwordHistoryData;
  }

  private static async disableUserPasswords(
    userId: UserAttributes['userId'],
    transaction?: Transaction
  ) {
    await models.Password.update(
      { active: false },
      {
        where: { userId, active: true },
        transaction: transaction,
      }
    );
  }

  private static async getNextPasswordSequence(
    userId: UserAttributes['userId'],
    transaction?: Transaction
  ): Promise<number> {
    const passwordHistoryData = await models.Password.findAll({
      where: { userId },
      order: [['passwordSeq', 'DESC']],
      limit: 1,
      transaction: transaction,
    });

    if (passwordHistoryData.length > 0) {
      return passwordHistoryData[0].passwordSeq + 1;
    } else {
      return 1;
    }
  }
}
