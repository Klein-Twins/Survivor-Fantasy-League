import { NOT_FOUND_ERROR } from '../../constants/auth/responseErrorConstants';
import { Season } from '../../generated-api';
import { SeasonsAttributes } from '../../models/season/Seasons';
import seasonRepository from '../../repositories/seasonRepository';
import errorFactory from '../../utils/errors/errorFactory';

const seasonService = {
  getSeasonBySeasonId,
  doesSeasonExist,
};
async function getSeasonBySeasonId(seasonId: number): Promise<Season> {
  const season: Season | null = await seasonRepository.getSeasonBySeasonId(seasonId);
  if (!season) {
    throw errorFactory(NOT_FOUND_ERROR);
  }
  return season;
}

async function doesSeasonExist(seasonId: number): Promise<boolean> {
  const season: Season | null = await seasonRepository.getSeasonBySeasonId(seasonId);
  return season !== null;
}

export default seasonService;
