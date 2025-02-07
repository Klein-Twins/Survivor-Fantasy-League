import { validate } from 'uuid';
import { BadRequestError } from '../../utils/errors/errors';
import profileHelper from '../auth/profileHelper';
import seasonHelper from '../season/seasonHelper';
import { LeagueAttributes } from '../../models/league/League';
import seasonService from '../../services/season/seasonService';
import { League, LeagueMember, Season } from '../../generated-api';
import leagueMemberService from '../../services/league/leagueMemberService';
import leagueRepository from '../../repositories/league/leagueRepository';
import { Transaction } from 'sequelize';

const leagueHelper = {
  validateCreateLeagueData,
  validateName,
  validateLeagueId,
  buildLeague,
  validateLeagueExists,
};

async function buildLeague(
  leagueAttributes: LeagueAttributes,
  transaction?: Transaction
): Promise<League> {
  const season: Season = await seasonService.getSeasonBySeasonId(
    leagueAttributes.seasonId
  );
  const leagueMembers: LeagueMember[] =
    await leagueMemberService.getLeagueMembers(
      leagueAttributes.leagueId,
      transaction
    );
  return {
    leagueId: leagueAttributes.leagueId,
    season,
    name: leagueAttributes.name,
    leagueMembers,
  };
}

async function validateLeagueExists(
  leagueId: LeagueAttributes['leagueId']
): Promise<League> {
  validateLeagueId(leagueId);
  const league: League = await leagueRepository.getLeague(leagueId);
  if (!league) {
    throw new BadRequestError('League does not exist');
  }
  return league;
}

async function validateCreateLeagueData(reqData: {
  name: string;
  seasonId: string;
  profileId: string;
}) {
  if (!reqData.name) {
    throw new BadRequestError('Name is required');
  }
  await seasonHelper.validateSeasonId(reqData.seasonId);
  await profileHelper.validateProfileId(reqData.profileId);
}

function validateName(name: string) {
  if (!name || name.length === 0) {
    throw new BadRequestError('Missing name');
  }
  if (!isValidName(name)) {
    throw new BadRequestError('Invalid name');
  }
}

function isValidName(name: string) {
  const regex = /^(?!.*\s\s)[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/;
  return regex.test(name);
}

function validateLeagueId(leagueId: string) {
  if (!leagueId || leagueId.length === 0) {
    throw new BadRequestError('League ID is required');
  }
  if (!validate(leagueId)) {
    throw new BadRequestError('Invalid League ID');
  }
}

export default leagueHelper;
