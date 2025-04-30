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

  async getPasswordHistory(
    userId: UserAttributes['userId']
  ): Promise<PasswordAttributes[]> {
    const passwordHistory = await models.Password.findAll({
      where: { userId },
      order: [['passwordSeq', 'ASC']],
    });
    return passwordHistory;
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
}
