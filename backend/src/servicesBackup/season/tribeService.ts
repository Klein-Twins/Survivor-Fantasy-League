import { UUID } from 'crypto';
import {
  CreateTribeRequestBody,
  SurvivorBasic,
  Tribe,
  TribeMembersState,
} from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { TribeAttributes } from '../../models/season/Tribes';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import tribeRepository from '../../repositoriesBackup/season/tribeRepository';
import { NotImplementedError } from '../../utils/errors/errors';
import tribeMemberService from './tribeMemberService';
import { models } from '../../config/db';

const tribeService = {
  getTribesBySeasonId,
  createTribe,
  getTribesOnEpisode,
  getTribesOnEpisode1,
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

async function getTribesOnEpisode1(
  episodeId: EpisodeAttributes['id']
): Promise<Map<TribeAttributes['id'], TribeMembersState>> {
  const episodeAttributes = await models.Episode.findByPk(episodeId);
  const tribesAttributes = await tribeRepository.getTribesBySeasonId(
    episodeAttributes!.seasonId
  );

  const tribeMap = new Map<TribeAttributes['id'], TribeMembersState>();

  for (const tribeAttributes of tribesAttributes) {
    const tribe = await buildTribe(tribeAttributes, episodeId);
    const tribeMembership = await tribeMemberService.getTribeState(
      tribeAttributes.id,
      episodeId
    );
    tribeMap.set(tribeAttributes.id, tribeMembership);
  }

  return tribeMap;
}

async function buildTribe(
  tribeAttributes: TribeAttributes,

  episodeId?: EpisodeAttributes['id']
): Promise<Tribe> {
  let survivorIds: SurvivorsAttributes['id'][] = [];
  let survivorBasic: SurvivorBasic[] = [];

  return {
    //seasonId: tribeAttributes.seasonId,
    id: tribeAttributes.id,
    name: tribeAttributes.name,
    color: {
      name: tribeAttributes.color,
      hex: tribeAttributes.hexColor,
    },
    isMergeTribe: tribeAttributes.mergeTribe,
    episodeStarted: tribeAttributes.episodeIdStart?.toString() || null,
    startingSurvivors: [],
  };
}

async function createTribe(tribeData: CreateTribeRequestBody): Promise<Tribe> {
  throw new NotImplementedError('createTribe');
}

export default tribeService;
