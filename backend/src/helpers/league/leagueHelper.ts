import { BadRequestError } from '../../utils/errors/errors';
import { LeagueAttributes } from '../../models/league/League';
import { ProfileAttributes } from '../../models/account/Profile';
import validator from 'validator';
import { UUID } from 'crypto';

const leagueHelper = {
  validateCreateLeagueData,
};

function validateCreateLeagueData(reqData: {
  name: string;
  seasonId: string;
  profileId: string;
}): {
  name: LeagueAttributes['name'];
  seasonId: LeagueAttributes['seasonId'];
  profileId: ProfileAttributes['profileId'];
} {
  const name = reqData.name.trim();
  if (!name) {
    throw new BadRequestError('Missing league name');
  }
  if (!validator.isLength(name, { min: 3, max: 50 })) {
    throw new BadRequestError(
      'Invalid Name: must be between 3 and 50 characters'
    );
  }
  if (!validator.isAlphanumeric(name)) {
    throw new BadRequestError('Invalid Name: must be alphanumeric');
  }

  const seasonId = reqData.seasonId.trim();
  if (!seasonId) {
    throw new BadRequestError('Missing season ID');
  }
  if (!validator.isNumeric(seasonId) || Number(seasonId) < 1) {
    throw new BadRequestError('Invalid Season ID');
  }

  const profileId = reqData.profileId.trim();
  if (!profileId) {
    throw new BadRequestError('Missing profile ID');
  }
  if (!validator.isUUID(profileId)) {
    throw new BadRequestError('Invalid Profile ID');
  }

  return {
    name,
    seasonId: Number(seasonId),
    profileId: profileId as UUID,
  };
}

export default leagueHelper;
