import { GetSeasonsResponseData } from '../../generated-api';
import { SeasonsAttributes } from '../../models/season/Seasons';
import seasonRepository from '../../repositories/seasons/seasonRepository';
import { NotFoundError } from '../../utils/errors/errors';

const seasonService = {
  doesSeasonExist,
  getSeasonBySeasonId,
  getAllSeasons,
};

async function doesSeasonExist(
  seasonId: SeasonsAttributes['seasonId']
): Promise<boolean> {
  try {
    await seasonRepository.getSeason(seasonId);
    return true;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return false;
    }
    throw error;
  }
}

async function getSeasonBySeasonId(seasonId: number) {
  return await seasonRepository.getSeason(seasonId);
}

async function getAllSeasons(): Promise<GetSeasonsResponseData> {
  return { seasons: await seasonRepository.getAllSeasons() };
}

export default seasonService;
