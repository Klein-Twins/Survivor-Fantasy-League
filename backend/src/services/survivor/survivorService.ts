import { Survivor } from '../../generated-api';
import { SeasonsAttributes } from '../../models/season/Seasons';
import survivorRepository from '../../repositories/survivors/survivorRepository';

const survivorService = {
  getSurvivorsBySeason,
};

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
