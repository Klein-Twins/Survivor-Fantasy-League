import { injectable } from 'tsyringe';
import { UserSessionAttributes } from '../../models/userSession/userSessions';
import { models } from '../../config/db';
import { Transaction } from 'sequelize';
import { UserAttributes } from '../../models/account/User';

@injectable()
export class UserSessionRepository {
  async saveUserSessionAttributes(
    attributes: UserSessionAttributes,
    transaction: Transaction
  ) {
    await models.UserSessions.upsert(attributes, { transaction });
  }

  async getUserSessions(
    accountId: UserAttributes['userId']
  ): Promise<UserSessionAttributes[]> {
    const userSessions = await models.UserSessions.findAll({
      where: {
        accountId,
      },
    });
    return userSessions.map((userSession) => userSession.get({ plain: true }));
  }
}
