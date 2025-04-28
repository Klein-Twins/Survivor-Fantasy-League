import { Transaction } from 'sequelize';
import { ProfileAttributes } from '../../models/account/Profile';
import { models } from '../../config/db';
import { UUID } from 'crypto';

export class ProfileRepository {
  static async getProfileByProfileId(
    profileId: UUID
  ): Promise<ProfileAttributes | null> {
    const profile = await models.Profile.findByPk(profileId);
    return profile ? profile.get({ plain: true }) : null;
  }

  static async saveProfileAttributes(
    attributes: ProfileAttributes,
    transaction: Transaction
  ) {
    await models.Profile.create(attributes, { transaction });
  }
}
