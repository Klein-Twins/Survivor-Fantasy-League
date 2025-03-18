import sequelize from '../../config/db';
import logger from '../../config/logger';
import { League, LeagueMember, LeagueMemberRole } from '../../generated-api';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueAttributes } from '../../models/league/League';
import {
  InviteStatus,
  LeagueProfileAttributes,
} from '../../models/league/LeagueProfile';
import { SeasonsAttributes } from '../../models/season/Seasons';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';
import leagueRepository from '../../repositories/league/leagueRepository';
import { NotFoundError } from '../../utils/errors/errors';
import seasonService from '../season/seasonService';
import leagueMemberService from './leagueMemberService';

const leagueService = {
  createLeague,
  getLeague,
  getLeaguesForProfile,
};

async function getLeague(leagueId: LeagueAttributes['leagueId']) {
  const leagueAttributes = await leagueRepository.getLeague(leagueId);
  if (!leagueAttributes) {
    throw new NotFoundError('League not found');
  }

  const leagueMembers = await leagueMemberService.getLeagueMembers(leagueId);
  return buildLeague(leagueAttributes, leagueMembers);
}

async function createLeague({
  name,
  seasonId,
  profileId,
}: {
  name: LeagueAttributes['name'];
  seasonId: LeagueAttributes['seasonId'];
  profileId: ProfileAttributes['profileId'];
}): Promise<League> {
  const transaction = await sequelize.transaction();

  try {
    const leagueAttributes: LeagueAttributes =
      await leagueRepository.createLeague(seasonId, name, transaction);

    const leagueMember = await leagueMemberService.createLeagueMember({
      leagueId: leagueAttributes.leagueId,
      profileId,
      inviterProfileId: profileId,
      role: LeagueMemberRole.Owner,
      inviteStatus: InviteStatus.Accepted,
      transaction,
    });

    await transaction.commit();

    return buildLeague(leagueAttributes, [leagueMember]);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function getLeaguesForProfile(
  profileId: ProfileAttributes['profileId'],
  seasonId: SeasonsAttributes['seasonId']
) {
  const leagueProfilesAttributes: LeagueProfileAttributes[] =
    await leagueMemberRepository.getLeagueProfiles(
      'profileId',
      profileId,
      seasonId
    );

  const enrolledProfilesAttributes = leagueProfilesAttributes.filter(
    (leagueProfile) => leagueProfile.inviteStatus === InviteStatus.Accepted
  );

  const leagues: League[] = [];

  for (const leagueProfile of enrolledProfilesAttributes) {
    const leagueAttributes = await leagueRepository.getLeague(
      leagueProfile.leagueId
    );
    if (!leagueAttributes) {
      logger.error(
        `League not found for leagueId: ${leagueProfile.leagueId} and leagueProfileId: ${leagueProfile.id}`
      );
      continue;
    }
    const leagueMembers = await leagueMemberService.getLeagueMembers(
      leagueProfile.leagueId
    );
    const league = buildLeague(leagueAttributes, leagueMembers);
    leagues.push(league);
  }

  return leagues;
}

function buildLeague(
  leagueAttributes: LeagueAttributes,
  leagueMembers: LeagueMember[]
): League {
  return {
    id: leagueAttributes.leagueId,
    seasonId: leagueAttributes.seasonId,
    name: leagueAttributes.name,
    leagueMembers,
  };
}

export default leagueService;
