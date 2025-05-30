import { Transaction } from 'sequelize';
import { AccountRole } from '../../generated-api';
import { UserAttributes } from '../../models/account/User';
import { models } from '../../config/db';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'crypto';

const userRepository = {
  createUser,
  getUserByField,
};

async function createUser(
  userName: UserAttributes['userName'],
  email: UserAttributes['email'],
  profileId: UserAttributes['profileId'],
  userRole: UserAttributes['userRole'] = AccountRole.User,
  transaction?: Transaction,
  userId?: UserAttributes['userId']
): Promise<UserAttributes> {
  let t = transaction;
  if (!t) {
    t = await models.sequelize.transaction();
  }
  try {
    userId = userId ? userId : (uuidv4() as UUID);
    const userAttributes = await models.User.create(
      {
        userId,
        userName: userName,
        email: email,
        profileId,
        userRole,
      },
      { transaction: t }
    );
    if (!transaction && t) {
      await t.commit();
    }
    return userAttributes;
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

async function getUserByField(
  field:
    | keyof Pick<UserAttributes, 'userId' | 'userName' | 'email' | 'profileId'>
    | 'leagueProfileId',
  value: string,
  transaction?: Transaction
): Promise<UserAttributes | null> {
  if (field === 'leagueProfileId') {
    return await models.User.findOne({
      transaction,
      include: [
        {
          model: models.Profile,
          required: true,
          as: 'profile',
          include: [
            {
              model: models.LeagueProfile,
              required: true,
              as: 'leagueProfiles',
              where: { id: value },
            },
          ],
        },
      ],
    });
  } else {
    return await models.User.findOne({
      where: { [field]: value },
      transaction,
    });
  }
}

export default userRepository;
