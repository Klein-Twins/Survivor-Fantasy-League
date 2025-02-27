import { Transaction } from 'sequelize';
import { sequelize } from '../../config/db';
import logger from '../../config/logger';
import {
  CreateLeagueRequestBody,
  CreateLeagueResponseData,
  GetLeaguesForProfileResponseData,
  League,
} from '../../generated-api';
import leagueHelper from '../../helpers/league/leagueHelper';
import leagueRepository from '../../repositories/league/leagueRepository';
import profileHelper from '../../helpers/auth/profileHelper';
import { InviteStatusEnum } from '../../models/league/LeagueProfile';

const leagueService = {
  createLeague,
  getLeague,
  getLeaguesForProfile,
};

async function getLeaguesForProfile(
  profileId: string
): Promise<GetLeaguesForProfileResponseData> {
  await profileHelper.validateProfileId(profileId);
  const leagues: League[] = await leagueRepository.getLeaguesForProfile(
    profileId,
    InviteStatusEnum.Accepted
  );
  const responseData: GetLeaguesForProfileResponseData = {
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
}: CreateLeagueRequestBody): Promise<CreateLeagueResponseData> {
  leagueHelper.validateCreateLeagueData({
    name,
    seasonId: seasonId.toString(),
    profileId,
  });
  const transaction = await sequelize.transaction();
  try {
    const league: League = await leagueRepository.createLeague(
      seasonId,
      name,
      profileId,
      transaction
    );
    await transaction.commit();
    const responseData: CreateLeagueResponseData = {
      league,
    };
    return responseData;
  } catch (error) {
    await transaction.rollback();
    logger.error('Transaction rolled back. Error creating league:', error);
    throw error;
  }
}

export default leagueService;
