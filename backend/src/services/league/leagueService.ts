import { Transaction } from 'sequelize';
import { sequelize } from '../../config/db';
import logger from '../../config/logger';
import {
  GetLeaguesResponseData,
  League,
  LeagueMemberRole,
} from '../../generated-api';
import leagueHelper from '../../helpers/league/leagueHelper';
import leagueRepository from '../../repositories/league/leagueRepository';
import profileHelper from '../../helpers/auth/profileHelper';
import {
  InviteStatusEnum,
  LeagueProfileAttributes,
} from '../../models/league/LeagueProfile';
import { UUID } from 'crypto';
import { LeagueAttributes } from '../../models/league/League';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';

const leagueService = {
  createLeague,
  getLeague,
  getLeaguesForProfile,
};

async function getLeaguesForProfile(
  profileId: string
): Promise<GetLeaguesResponseData> {
  await profileHelper.validateProfileId(profileId);
  const leagues: League[] = await leagueRepository.getLeaguesForProfile(
    profileId,
    InviteStatusEnum.Accepted
  );
  const responseData: GetLeaguesResponseData = {
    leagues,
  };
  return responseData;
}

//TODO: Consider removing this function...
async function getLeague(
  leagueId: string,
  transaction?: Transaction
): Promise<League> {
  leagueHelper.validateLeagueId(leagueId);
  return await leagueRepository.getLeague(leagueId, transaction);
}

async function createLeague({
  name,
  seasonId,
  profileId,
}: {
  name: string;
  seasonId: number;
  profileId: UUID;
}): Promise<League> {
  const transaction = await sequelize.transaction();
  try {
    const leagueAttributes: LeagueAttributes =
      await leagueRepository.createLeague(seasonId, name, transaction);
    const leagueProfileAttributes: LeagueProfileAttributes =
      await leagueMemberRepository.createLeagueMember(
        leagueAttributes.leagueId,
        profileId,
        null,
        LeagueMemberRole.Owner,
        InviteStatusEnum.Accepted,
        transaction
      );
    await transaction.commit();

    const league: League = await leagueHelper.buildLeague(leagueAttributes);
    return league;
  } catch (error) {
    await transaction.rollback();
    logger.error('Transaction rolled back. Error creating league:', error);
    throw error;
  }
}

export default leagueService;
