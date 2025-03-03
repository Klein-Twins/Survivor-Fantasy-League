import { CreateSurvivorRequestBody, Survivor } from '../../generated-api';
import { SeasonsAttributes } from '../../models/season/Seasons';
import survivorRepository from '../../repositories/survivors/survivorRepository';
import { v4 as uuid } from 'uuid';

const survivorService = {
  getSurvivorsBySeason,
  createSurvivor,
};

async function createSurvivor(
  survivorData: CreateSurvivorRequestBody
): Promise<Survivor> {
  const survivorId = uuid();
  const survivor: Survivor = await survivorRepository.createSurvivor(
    survivorId,
    survivorData
  );

  return survivor;
}

async function getSurvivorsBySeason(
  seasonIds: SeasonsAttributes['seasonId'][]
): Promise<Survivor[]> {
  let survivors: Survivor[] = [];

  for (const seasonId of seasonIds) {
    const survivorsOnSeason = await survivorRepository.getSurvivorsBySeasonId(
      seasonId
    );
    survivors = survivors.concat(survivorsOnSeason);
  }
  return survivors;
}

export default survivorService;
