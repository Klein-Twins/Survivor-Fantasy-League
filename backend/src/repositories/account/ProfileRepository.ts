import { Transaction } from 'sequelize';
import { ProfileAttributes } from '../../models/account/Profile';
import { models } from '../../config/db';
import { UUID } from 'crypto';
import { injectable } from 'tsyringe';

@injectable()
export class ProfileRepository {
  async getProfileByProfileId(
    profileId: UUID
  ): Promise<ProfileAttributes | null> {
    const profile = await models.Profile.findByPk(profileId);
    return profile ? profile.get({ plain: true }) : null;
  }

  async saveProfileAttributes(
    attributes: ProfileAttributes,
    transaction: Transaction
  ) {
    await models.Profile.create(attributes, { transaction });
  }
}
