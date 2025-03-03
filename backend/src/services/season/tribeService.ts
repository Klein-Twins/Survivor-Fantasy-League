import { CreateTribeRequestBody, Tribe } from '../../generated-api';
import { SeasonsAttributes } from '../../models/season/Seasons';
import tribeRepository from '../../repositories/seasons/tribeRepository';
import {
  BadRequestError,
  NotImplementedError,
} from '../../utils/errors/errors';
import seasonService from './seasonService';

const tribeService = {
  getTribes,
  createTribe,
};

async function getTribes(
  seasonId: SeasonsAttributes['seasonId']
): Promise<Tribe[]> {
  //TODO ADD OTHER PARAMETERS
  return await tribeRepository.getTribesBySeasonId(seasonId);
}

async function createTribe(tribeData: CreateTribeRequestBody): Promise<Tribe> {
  const doesSeasonExist: boolean = await seasonService.doesSeasonExist(
    tribeData.seasonId
  );
  if (!doesSeasonExist) {
    throw new BadRequestError('Season does not exist');
  }

  return await tribeRepository.createTribe(tribeData);
}

export default tribeService;
