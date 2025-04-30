import { Transaction } from 'sequelize';
import { PasswordAttributes } from '../../models/account/Password';
import { UserAttributes } from '../../models/account/User';
import { models } from '../../config/db';
import { PasswordHelper } from '../../helpers/account/PasswordHelper';
import { inject, injectable } from 'tsyringe';
import { Password } from '../../domain/account/Passwords';
import logger from '../../config/logger';

@injectable()
export class PasswordRepository {
  constructor(@inject(PasswordHelper) private passwordHelper: PasswordHelper) {}

  async getActivePassword(
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

  async createNewPasswordAttributes(
    password: string
  ): Promise<Omit<PasswordAttributes, 'userId'>> {
    const hashedPassword = await this.passwordHelper.hashPassword(password);
    return {
      password: hashedPassword,
      passwordSeq: 1,
      active: true,
    };
  }

  async savePassword(
    password: Password,
    userId: UserAttributes['userId'],
    transaction: Transaction
  ) {
    logger.debug(
      `Saving password for UserId: ${userId}: ${password.toString()}`
    );
    await models.Password.create(
      {
        password: password.getHashedPassword(),
        userId,
        passwordSeq: password.getSeq(),
        active: password.getActive(),
      },
      { transaction }
    );
    logger.debug(`Saved Password`);
  }

  async saveNewPassword(
    {
      password,
      userId,
    }: {
      password: PasswordAttributes['password'];
      userId: UserAttributes['userId'];
    },
    transaction: Transaction
  ) {
    const hashedPassword: string = await this.passwordHelper.hashPassword(
      password
    );

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

  private async findUserPasswordHistory(
    userId: UserAttributes['userId'],
    transaction?: Transaction
  ): Promise<PasswordAttributes[]> {
    const passwordHistoryData = await models.Password.findAll({
      where: { userId },
      transaction: transaction,
    });
    return passwordHistoryData;
  }

  private async disableUserPasswords(
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

  private async getNextPasswordSequence(
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
