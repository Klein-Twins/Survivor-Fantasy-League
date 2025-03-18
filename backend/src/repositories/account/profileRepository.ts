import { Transaction } from 'sequelize';
import { ProfileAttributes } from '../../models/account/Profile';
import { v4 as uuidv4 } from 'uuid';
import { models } from '../../config/db';

const profileRepository = {
  createProfile,
  getProfile,
};

async function createProfile(
  firstName: ProfileAttributes['firstName'],
  lastName: ProfileAttributes['lastName'],
  transaction: Transaction
): Promise<ProfileAttributes> {
  let t = transaction;
  if (!t) {
    t = await models.sequelize.transaction();
  }
  const profileId = uuidv4() as ProfileAttributes['profileId'];
  try {
    const profileRecord: ProfileAttributes = await models.Profile.create(
      {
        profileId: profileId,
        firstName: firstName,
        lastName: lastName,
      },
      { transaction }
    );
    if (!transaction && t) {
      await t.commit();
    }
    return profileRecord;
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

async function getProfile(
  profileId: ProfileAttributes['profileId'],
  transaction?: Transaction
): Promise<ProfileAttributes | null> {
  const profileAttributes: ProfileAttributes | null =
    await models.Profile.findOne({
      where: { profileId },
      transaction,
    });
  return profileAttributes;
}

export default profileRepository;
