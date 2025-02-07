import { ParsedQs } from 'qs';
import { BadRequestError } from '../../utils/errors/errors';
import seasonHelper from '../season/seasonHelper';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { Survivor } from '../../generated-api';

const survivorHelper = {
  validateAndFormatGetSurvivorsRequest,
  buildSurvivor,
};

function buildSurvivor(
  survivorAttributes: SurvivorsAttributes,
  survivorDetailAttributes: SurvivorDetailsOnSeasonAttributes
): Survivor {
  return {
    survivorId: survivorAttributes.survivorId,
    firstName: survivorAttributes.firstName,
    lastName: survivorAttributes.lastName,
    fromCity: survivorAttributes.fromCity,
    fromState: survivorAttributes.fromState,
    fromCountry: survivorAttributes.fromCountry,
    nickName: survivorAttributes.nickName,
    seasonId: survivorDetailAttributes.seasonId,
    age: survivorDetailAttributes.age,
    description: survivorDetailAttributes.description,
    job: survivorDetailAttributes.job,
    imageUrl: survivorDetailAttributes.imageUrl,
  };
}

function validateAndFormatGetSurvivorsRequest(
  seasonIds: ParsedQs[string]
): SeasonsAttributes['seasonId'][] {
  if (!seasonIds) {
    throw new BadRequestError('Season ID is required');
  }

  const seasonIdArray: string[] = Array.isArray(seasonIds)
    ? seasonIds.map((id) => id.toString())
    : [seasonIds.toString()];

  const validSeasonIds: number[] = seasonIdArray.map((seasonId) => {
    seasonHelper.validateSeasonId(seasonId);
    return seasonHelper.formatSeasonId(seasonId);
  });

  return validSeasonIds;
}

export default survivorHelper;
