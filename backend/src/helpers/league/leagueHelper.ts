import { validate } from 'uuid';
import { BadRequestError } from '../../utils/errors/errors';
import profileHelper from '../auth/profileHelper';
import seasonHelper from '../season/seasonHelper';
import { LeagueAttributes } from '../../models/league/League';
import seasonService from '../../services/season/seasonService';
import {
  CreateLeagueRequestBody,
  League,
  LeagueMember,
  Season,
} from '../../generated-api';
import leagueMemberService from '../../services/league/leagueMemberService';
import leagueRepository from '../../repositories/league/leagueRepository';
import { Transaction } from 'sequelize';
import { validate as validateUuid } from 'uuid';
import { UUID } from 'crypto';

const leagueHelper = {
  validateCreateLeagueData,
  validateName,
  validateLeagueId,
  buildLeague,
  validateLeagueExists,
};

async function buildLeague(
  leagueAttributes: LeagueAttributes
): Promise<League> {
  const season: Season = await seasonService.getSeasonBySeasonId(
    leagueAttributes.seasonId
  );
  const leagueMembers: LeagueMember[] =
    await leagueMemberService.getLeagueMembers(leagueAttributes.leagueId);
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

function validateCreateLeagueData(reqData: {
  name: string;
  seasonId: string;
  profileId: string;
}): {
  name: string;
  seasonId: number;
  profileId: UUID;
} {
  if (!reqData.name || reqData.name.trim().length === 0) {
    throw new BadRequestError('Missing name');
  }
  if (!reqData.name.match(/^[a-zA-Z ]+$/)) {
    throw new BadRequestError('Invalid name');
  }

  if (!reqData.seasonId) {
    throw new BadRequestError('Missing seasonId');
  }
  if (reqData.seasonId.trim().length === 0) {
    throw new BadRequestError('Invalid seasonId');
  }
  if (Number.isNaN(Number(reqData.seasonId))) {
    throw new BadRequestError('Invalid seasonId');
  }
  if (Number(reqData.seasonId) <= 0) {
    throw new BadRequestError('Invalid seasonId');
  }

  if (!reqData.profileId) {
    throw new BadRequestError('Missing profileId');
  }
  if (!validateUuid(reqData.profileId)) {
    throw new BadRequestError('Invalid profileId');
  }

  return {
    name: reqData.name.trim(),
    seasonId: Number(reqData.seasonId),
    profileId: reqData.profileId as UUID,
  };
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
