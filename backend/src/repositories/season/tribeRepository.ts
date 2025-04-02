import { Op, Sequelize } from 'sequelize';
import sequelize, { models } from '../../config/db';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { TribeAttributes } from '../../models/season/Tribes';
import episodeService from '../../services/season/episodeService';
import { NotImplementedError } from '../../utils/errors/errors';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import { EpisodeType } from '../../generated-api';

const tribeRepository = {
  getTribesBySeasonId,
  getStartingSurvivorsByTribeIds,
  getTribesOnEpisode,
};

async function getStartingSurvivorsByTribeIds(
  tribeId: TribeAttributes['id']
): Promise<SurvivorsAttributes['id'][]> {
  const survivorIds = await models.SurvivorDetailsOnSeason.findAll({
    where: {
      originalTribeId: tribeId,
    },
  });
  return survivorIds.map((survivor) => survivor.id);
}

async function getTribesBySeasonId(
  seasonId: SeasonsAttributes['seasonId']
): Promise<TribeAttributes[]> {
  const tribesAttributes: TribeAttributes[] = await models.Tribe.findAll({
    where: {
      seasonId: seasonId,
    },
  });
  return tribesAttributes;
}

async function getTribesOnEpisode(
  episodeId: EpisodeAttributes['episodeId']
): Promise<TribeAttributes[]> {
  // Fetch the episode to get its episode number
  const episode = await episodeService.getEpisode('episodeId', episodeId);
  const episodeNumber = episode.number;
  const episodeType = episode.episodeType;

  if (
    episodeType === EpisodeType.PREMIERE ||
    episodeType === EpisodeType.PREMERGE
  ) {
    const premierEpisode = await episodeService.getPremierEpisodeInSeason(
      episode.seasonId
    );
    const startingTribeAttributes = await models.Tribe.findAll({
      where: {
        seasonId: episode.seasonId,
        episodeStarted: premierEpisode.id,
      },
    });
    return startingTribeAttributes;
  } else if (episodeType === EpisodeType.TRIBELESS) {
    return [];
  } else {
    throw new NotImplementedError(
      'tribeRepository.getTribesOnEpisode not implemented for Post-Merge episodes'
    );
  }
}

export default tribeRepository;
