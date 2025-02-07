import { Transaction } from 'sequelize';
import { LeagueMember } from '../../generated-api';
import {
  InviteStatusEnum,
  LeagueProfileAttributes,
} from '../../models/league/LeagueProfile';
import { models, sequelize } from '../../config/db';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../../utils/errors/errors';
import leagueMemberHelper from '../../helpers/league/leagueMemberHelper';

const leagueMemberRepository = {
  createLeagueMember,
  getLeagueMembers,
  getLeagueProfile,
};

async function getLeagueProfile(
  leagueId: LeagueProfileAttributes['leagueId'],
  profileId: LeagueProfileAttributes['profileId'],
  transaction?: Transaction
): Promise<LeagueMember> {
  const leagueProfile: LeagueProfileAttributes | null =
    await models.LeagueProfile.findOne({
      where: {
        leagueId: leagueId,
        profileId: profileId,
      },
      transaction,
    });
  if (!leagueProfile) {
    throw new Error('Profile is not in league');
  }
  return await leagueMemberHelper.buildLeagueMember(leagueProfile);
}

async function getLeagueMembers(
  leagueId: LeagueProfileAttributes['leagueId'],
  transaction?: Transaction
): Promise<LeagueMember[]> {
  const leagueProfilesAttributes: LeagueProfileAttributes[] =
    await models.LeagueProfile.findAll({
      where: {
        leagueId: leagueId,
        inviteStatus: InviteStatusEnum.Accepted,
      },
      transaction,
    });

  if (leagueProfilesAttributes.length === 0) {
    throw new NotFoundError(
      `League members not found for leagueId: ${leagueId}`
    );
  }

  const leagueMembers: Promise<LeagueMember>[] = leagueProfilesAttributes.map(
    async (leagueProfileAttributes: LeagueProfileAttributes) => {
      return await leagueMemberHelper.buildLeagueMember(
        leagueProfileAttributes
      );
    }
  );

  return Promise.all(leagueMembers);
}

async function createLeagueMember(
  leagueId: LeagueProfileAttributes['leagueId'],
  profileId: LeagueProfileAttributes['profileId'],
  inviterProfileId: LeagueProfileAttributes['inviterProfileId'],
  role: LeagueProfileAttributes['role'],
  inviteStatus: LeagueProfileAttributes['inviteStatus'],
  transaction?: Transaction
): Promise<LeagueMember> {
  let t = transaction;
  if (!transaction) {
    t = await sequelize.transaction();
  }
  try {
    const leagueMember: LeagueProfileAttributes =
      await models.LeagueProfile.create(
        {
          id: uuidv4(),
          leagueId: leagueId,
          profileId: profileId,
          inviterProfileId: inviterProfileId,
          role: role,
          inviteStatus: inviteStatus,
        },
        { transaction: t }
      );

    if (!transaction && t) {
      await t.commit();
    }
    return await leagueMemberHelper.buildLeagueMember(leagueMember);
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

export default leagueMemberRepository;
