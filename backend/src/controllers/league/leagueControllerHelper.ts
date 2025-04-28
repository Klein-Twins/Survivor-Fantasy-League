import { UUID } from 'crypto';
import { CreateLeagueRequestBody } from '../../generated-api';
import { BadRequestError } from '../../utils/errors/errors';
import { CreateLeaguePathParams } from './leagueController';
import validator from 'validator';

const leagueControllerHelper = {
  validateCreateLeagueRequest,
  validateGetLeaguesRequest,
};

function validateGetLeaguesRequest({
  profileId,
  seasonId,
}: {
  profileId: string;
  seasonId: string;
}): {
  pathParams: CreateLeaguePathParams;
} {
  if (!profileId) {
    throw new BadRequestError('Profile ID is required');
  }
  if (!seasonId) {
    throw new BadRequestError('Season ID is required');
  }

  if (!validator.isUUID(profileId)) {
    throw new BadRequestError('Profile ID is not a valid UUID');
  }
  if (!validator.isNumeric(seasonId, {})) {
    throw new BadRequestError('Season ID is not a valid number');
  }
  const seasonIdNum = parseInt(seasonId, 10);
  if (seasonIdNum < 0) {
    throw new BadRequestError('Season ID must be a positive number');
  }

  return {
    pathParams: {
      profileId: profileId as UUID,
      seasonId: seasonIdNum,
    },
  };
}

function validateCreateLeagueRequest({
  profileId,
  seasonId,
  name,
}: {
  profileId: string;
  seasonId: string;
  name: string;
}): {
  pathParams: CreateLeaguePathParams;
  body: CreateLeagueRequestBody;
} {
  if (!profileId) {
    throw new BadRequestError('Profile ID is required');
  }
  if (!seasonId) {
    throw new BadRequestError('Season ID is required');
  }
  if (!name) {
    throw new BadRequestError('League name is required');
  }

  if (!validator.isLength(name, { min: 5, max: 50 })) {
    throw new BadRequestError(
      'League name must be between 1 and 50 characters'
    );
  }
  if (!validator.isAlphanumeric(name, 'en-US', { ignore: ' ' })) {
    throw new BadRequestError(
      'League name must only contain letters and numbers'
    );
  }
  if (!validator.isUUID(profileId)) {
    throw new BadRequestError('Profile ID is not a valid UUID');
  }
  if (!validator.isNumeric(seasonId, {})) {
    throw new BadRequestError('Season ID is not a valid number');
  }
  const seasonIdNum = parseInt(seasonId, 10);
  if (seasonIdNum < 0) {
    throw new BadRequestError('Season ID must be a positive number');
  }

  return {
    pathParams: {
      profileId: profileId as UUID,
      seasonId: seasonIdNum,
    },
    body: {
      name,
    },
  };
}

export default leagueControllerHelper;
