import { Tribe } from '../../generated-api';
import { SeasonsAttributes } from '../../models/season/Seasons';
import tribeRepository from '../../repositories/seasons/tribeRepository';

const tribeService = {
  getTribes,
};

async function getTribes(
  seasonId: SeasonsAttributes['seasonId']
): Promise<Tribe[]> {
  //TODO ADD OTHER PARAMETERS
  return await tribeRepository.getTribesBySeasonId(seasonId);
}

export default tribeService;
