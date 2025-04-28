import { Transaction } from 'sequelize';
import { UserAttributes } from '../../models/account/User';
import { models } from '../../config/db';

export class UserRepository {
  static async getUserByEmail(email: string): Promise<UserAttributes | null> {
    const user = await models.User.findOne({
      where: { email },
    });
    return user ? user.get({ plain: true }) : null;
  }

  static async getUserByUserId(
    userId: UserAttributes['userId']
  ): Promise<UserAttributes | null> {
    const user = await models.User.findOne({
      where: { userId },
    });
    return user ? user.get({ plain: true }) : null;
  }

  static async getUserByProfileId(
    profileId: UserAttributes['profileId']
  ): Promise<UserAttributes | null> {
    const user = await models.User.findOne({
      where: { profileId },
    });
    return user ? user.get({ plain: true }) : null;
  }

  static async saveUserAttributes(
    attributes: UserAttributes,
    transaction: Transaction
  ) {
    await models.User.create(attributes, { transaction });
  }
}
