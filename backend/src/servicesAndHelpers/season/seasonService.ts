import { Season } from '../../generated-api';
import seasonRepository from '../../repositories/seasonRepository';
import { NotFoundError } from '../../utils/errors/errors';

const seasonService = {
  getSeasonBySeasonId,
  doesSeasonExist,
};
async function getSeasonBySeasonId(seasonId: number): Promise<Season> {
  const season: Season | null = await seasonRepository.getSeasonBySeasonId(seasonId);
  if (!season) {
    throw new NotFoundError();
  }
  return season;
}

async function doesSeasonExist(seasonId: number): Promise<boolean> {
  const season: Season | null = await seasonRepository.getSeasonBySeasonId(seasonId);
  return season !== null;
}

export default seasonService;
