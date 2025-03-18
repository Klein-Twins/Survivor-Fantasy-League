import { Transaction } from 'sequelize';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueAttributes } from '../../models/league/League';
import { LeagueProfileAttributes } from '../../models/league/LeagueProfile';
import sequelize, { models } from '../../config/db';

import { v4 as uuidv4 } from 'uuid';
import { SeasonsAttributes } from '../../models/season/Seasons';

const leagueMemberRepository = {
  createLeagueMember,
  getLeagueProfiles,
};

async function createLeagueMember({
  leagueId,
  profileId,
  inviterProfileId,
  role,
  inviteStatus,
  transaction,
}: {
  leagueId: LeagueAttributes['leagueId'];
  profileId: ProfileAttributes['profileId'];
  inviterProfileId: ProfileAttributes['profileId'];
  role: LeagueProfileAttributes['role'];
  inviteStatus: LeagueProfileAttributes['inviteStatus'];
  transaction?: Transaction;
}): Promise<LeagueProfileAttributes> {
  let t = transaction;
  if (!t) {
    t = await sequelize.transaction();
  }
  try {
    const leagueProfileId = uuidv4();
    const leagueProfileAttributes: LeagueProfileAttributes =
      await models.LeagueProfile.create(
        {
          id: leagueProfileId,
          leagueId,
          profileId,
          inviterProfileId,
          role,
          inviteStatus,
        },
        { transaction: t }
      );
    if (!transaction && t) {
      await t.commit();
    }
    return leagueProfileAttributes;
  } catch (error) {
    if (!transaction) {
      await t.rollback();
    }
    throw error;
  }
}

async function getLeagueProfiles(
  field: keyof Pick<LeagueProfileAttributes, 'leagueId' | 'profileId'>,
  value:
    | LeagueProfileAttributes['leagueId']
    | LeagueProfileAttributes['profileId'],
  seasonId?: SeasonsAttributes['seasonId']
): Promise<LeagueProfileAttributes[]> {
  if (!seasonId) {
    const leagueProfilesAttributes = await models.LeagueProfile.findAll({
      where: {
        [field]: value,
      },
    });
    return leagueProfilesAttributes;
  } else {
    const leagueProfilesAttributes = await models.LeagueProfile.findAll({
      where: {
        [field]: value, // Filter by the provided field and value
      },
      include: [
        {
          model: models.League, // Join with the League model
          as: 'league', // Ensure this matches the alias in your model association
          where: {
            seasonId, // Filter by seasonId
          },
        },
      ],
    });

    return leagueProfilesAttributes;
  }
}

export default leagueMemberRepository;
