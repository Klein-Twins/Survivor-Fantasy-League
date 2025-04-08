import { UUID } from 'crypto';
import {
  CreateTribeRequestBody,
  SurvivorBasic,
  Tribe,
} from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { TribeAttributes } from '../../models/season/Tribes';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import tribeRepository from '../../repositories/season/tribeRepository';
import { NotImplementedError } from '../../utils/errors/errors';
import tribeMemberService from './tribeMemberService';
import survivorService from './survivorService';
import { NODE_ENV } from '../../config/config';
import logger from '../../config/logger';
import episodeService from './episodeService';

const tribeService = {
  getTribesBySeasonId,
  createTribe,
  getTribesOnEpisode,
};
``;
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

async function getTribesOnEpisode(
  episodeId: EpisodeAttributes['id']
): Promise<Tribe[]> {
  const tribesAttributes = await tribeRepository.getTribesOnEpisode(episodeId);
  return await Promise.all(
    tribesAttributes.map(
      async (tribeAttribute) => await buildTribe(tribeAttribute, episodeId)
    )
  );
}

async function buildTribe(
  tribeAttributes: TribeAttributes,

  episodeId?: EpisodeAttributes['id']
): Promise<Tribe> {
  let survivorIds: SurvivorsAttributes['id'][] = [];
  let survivorBasic: SurvivorBasic[] = [];
  if (!episodeId) {
    survivorIds = await tribeRepository.getStartingSurvivorsByTribeIds(
      tribeAttributes.id
    );
  } else {
    const survivors = await tribeMemberService.getTribeMembers(
      tribeAttributes.id,
      episodeId
    );
    survivorIds = survivors.map((survivor) => survivor.id as UUID);
  }
  survivorBasic = await Promise.all(
    survivorIds.map(
      async (id) => await survivorService.getBasicSurvivorDetails(id)
    )
  );

  if (NODE_ENV === 'development') {
    if (episodeId) {
      const episode = await episodeService.getEpisode('episodeId', episodeId);
      logger.debug('In Episode: ' + episode.number);
    }

    logger.debug(
      `Tribe ${tribeAttributes.name} has survivors: ${survivorBasic.map(
        (survivor) => survivor.name
      )}`
    );
  }

  return {
    seasonId: tribeAttributes.seasonId.toString(),
    id: tribeAttributes.id,
    name: tribeAttributes.name,
    color: {
      name: tribeAttributes.color,
      hex: tribeAttributes.hexColor,
    },
    isMergeTribe: tribeAttributes.mergeTribe,
    episodeStarted: tribeAttributes.episodeIdStart?.toString() || null,
    survivors: survivorBasic,
  };
}

async function createTribe(tribeData: CreateTribeRequestBody): Promise<Tribe> {
  throw new NotImplementedError('createTribe');
}

export default tribeService;
