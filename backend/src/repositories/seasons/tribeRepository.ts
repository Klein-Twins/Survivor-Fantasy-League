import { UUID } from 'crypto';
import { models } from '../../config/db';
import { CreateTribeRequestBody, Tribe } from '../../generated-api';
import tribeHelper from '../../helpers/season/tribeHelper';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { TribeAttributes } from '../../models/season/Tribes';
import episodeService from '../../services/season/episodeService';
import { NotFoundError } from '../../utils/errors/errors';
import { v4 as uuidv4 } from 'uuid';

const tribeRepository = {
  getTribesBySeasonId,
  createTribe,
};

async function createTribe(tribeData: CreateTribeRequestBody): Promise<Tribe> {
  const episodeId = await episodeService
    .getEpisodeBySeasonAndEpisodeNumber(
      tribeData.seasonId,
      tribeData.episodeStarted
    )
    .then((episode) => episode.id);

  const tribeId: UUID | string = uuidv4();

  const tribeAttributes: TribeAttributes = await models.Tribe.create({
    name: tribeData.name,
    tribeColor: tribeData.color,
    seasonId: tribeData.seasonId,
    mergeTribe: tribeData.isMergeTribe,
    episodeStarted: episodeId,
    id: tribeId,
  });

  return await tribeHelper.buildTribe(tribeAttributes);
}

async function getTribesBySeasonId(
  seasonId: SeasonsAttributes['seasonId']
): Promise<Tribe[]> {
  const tribesAttributes: TribeAttributes[] = await models.Tribe.findAll({
    where: {
      seasonId: seasonId,
    },
  });

  if (tribesAttributes.length === 0) {
    throw new NotFoundError('Tribes not found');
  }

  return Promise.all(
    tribesAttributes.map(async (tribeAttributes) => {
      return await tribeHelper.buildTribe(tribeAttributes);
    })
  );
}
export default tribeRepository;
