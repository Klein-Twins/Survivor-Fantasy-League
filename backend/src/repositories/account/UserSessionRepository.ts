import { injectable } from 'tsyringe';
import { UserSessionAttributes } from '../../models/userSession/userSessions';
import { models } from '../../config/db';
import { Transaction } from 'sequelize';

@injectable()
export class UserSessionRepository {
  async saveUserSessionAttributes(
    attributes: UserSessionAttributes,
    transaction: Transaction
  ) {
    await models.UserSessions.upsert(attributes, { transaction });
  }
}
