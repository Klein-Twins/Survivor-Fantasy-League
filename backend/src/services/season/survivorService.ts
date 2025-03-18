import { CreateSurvivorRequestBody, Survivor } from '../../generated-api';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import survivorRepository from '../../repositories/season/survivorRepository';
import { NotImplementedError } from '../../utils/errors/errors';

const survivorService = {
  getSurvivorsBySeason,
  createSurvivor,
};

async function getSurvivorsBySeason(
  seasonId: SeasonsAttributes['seasonId']
): Promise<Survivor[]> {
  const survivorsOnSeasonData = await survivorRepository.getSurvivorsBySeasonId(
    seasonId
  );

  const survivors: Survivor[] = [];

  for (const survivorData of survivorsOnSeasonData) {
    survivors.push(buildSurvivor(survivorData.survivor, survivorData));
  }

  return survivors;
}

async function createSurvivor(
  reqData: CreateSurvivorRequestBody
): Promise<Survivor> {
  throw new NotImplementedError('createSurvivor');
}

function buildSurvivor(
  survivorAttributes: SurvivorsAttributes,
  survivorDetailAttributes: SurvivorDetailsOnSeasonAttributes
): Survivor {
  return {
    id: survivorAttributes.id,
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
  };
}

export default survivorService;
