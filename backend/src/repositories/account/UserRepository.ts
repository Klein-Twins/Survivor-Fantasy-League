import { Transaction } from 'sequelize';
import { UserAttributes } from '../../models/account/User';
import { models } from '../../config/db';
import { injectable } from 'tsyringe';

@injectable()
export class UserRepository {
  async getUserByEmail(email: string): Promise<UserAttributes | null> {
    const user = await models.User.findOne({
      where: { email },
    });
    return user ? user.get({ plain: true }) : null;
  }

  async getUserByUserId(
    userId: UserAttributes['userId']
  ): Promise<UserAttributes | null> {
    const user = await models.User.findOne({
      where: { userId },
    });
    return user ? user.get({ plain: true }) : null;
  }

  async getUserByProfileId(
    profileId: UserAttributes['profileId']
  ): Promise<UserAttributes | null> {
    const user = await models.User.findOne({
      where: { profileId },
    });
    return user ? user.get({ plain: true }) : null;
  }

  async saveUserAttributes(
    attributes: UserAttributes,
    transaction: Transaction
  ) {
    await models.User.create(attributes, { transaction });
  }
}
