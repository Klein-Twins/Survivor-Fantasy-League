import {
  INVALID_NAME_ERROR,
  INVALID_PROFILE_ID_ERROR,
  INVALID_SEASON_ID_ERROR,
} from '../../constants/auth/responseErrorConstants';
import { CreateLeagueRequest } from '../../types/league/leagueDto';
import { BadRequestError } from '../../utils/errors/errors';

const leagueControllerHelper = {
  validateGetLeaguesForProfileRequest,
  validateCreateLeagueRequest,
  formatCreateLeagueRequest,
};

function validateGetLeaguesForProfileRequest(profileId: string | undefined): boolean {
  if (!profileId) {
    return false;
  }
  return true;
}
function validateCreateLeagueRequest(reqBody: CreateLeagueRequest): void {
  if (!reqBody.seasonId) {
    throw new BadRequestError('Missing seasonId');
  }
  if (!reqBody.name) {
    throw new BadRequestError('Missing name');
  }
  if (!reqBody.profileId) {
    throw new BadRequestError('Missing profileId');
  }
}

function formatCreateLeagueRequest(reqBody: CreateLeagueRequest): CreateLeagueRequest {
  const seasonId: number | undefined = formatSeasonId(reqBody.seasonId);
  if (!seasonId) {
    throw new BadRequestError('Missing seasonId');
  }
  return {
    seasonId,
    name: reqBody.name,
    profileId: reqBody.profileId,
  };
}

function formatSeasonId(seasonId: string | number | undefined): number | undefined {
  return seasonId ? parseInt(seasonId.toString(), 10) : undefined;
}

export default leagueControllerHelper;
