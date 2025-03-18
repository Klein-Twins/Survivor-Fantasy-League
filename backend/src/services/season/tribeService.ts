import { CreateTribeRequestBody, Tribe } from '../../generated-api';
import { TribeAttributes } from '../../models/season/Tribes';
import tribeRepository from '../../repositories/season/tribeRepository';
import { NotImplementedError } from '../../utils/errors/errors';

const tribeService = {
  getTribesBySeasonId,
  createTribe,
};

async function getTribesBySeasonId(
  seasonId: TribeAttributes['seasonId']
): Promise<Tribe[]> {
  const tribesAttributes: TribeAttributes[] =
    await tribeRepository.getTribesBySeasonId(seasonId);

  return Promise.all(
    tribesAttributes.map(async (tribeAttributes) => {
      return await buildTribe(tribeAttributes);
    })
  );
}

async function buildTribe(tribeAttributes: TribeAttributes): Promise<Tribe> {
  return {
    seasonId: tribeAttributes.seasonId.toString(),
    id: tribeAttributes.id,
    name: tribeAttributes.name,
    color: {
      name: tribeAttributes.tribeColor,
      hex: tribeAttributes.tribeHexColor,
    },
    isMergeTribe: tribeAttributes.mergeTribe,
    episodeStarted: tribeAttributes.episodeStarted.toString(),
    //TODO: Implement this for tribe history
    currentSurvivorIds: [],
  };
}

async function createTribe(tribeData: CreateTribeRequestBody): Promise<Tribe> {
  throw new NotImplementedError('createTribe');
}

export default tribeService;
