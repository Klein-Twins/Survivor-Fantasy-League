import { UUID } from 'crypto';
import { models } from '../../config/db';
import { EpisodeAttributes } from '../../models/season/Episodes';
import logger from '../../config/logger';

const episodeRepository = {
  getEpisodeBySeasonAndEpisodeNumber,
  getEpisodesBySeason,
  getEpisodeByEpisodeId,
  getEpisodeIdsBySeasonAndEpisodeNumber,
};

async function getEpisodeIdsBySeasonAndEpisodeNumber(
  seasonId: number,
  episodeNumbers: number | number[]
): Promise<UUID[]> {
  if (!Array.isArray(episodeNumbers)) {
    episodeNumbers = [episodeNumbers];
  }

  const episodeIds: UUID[] = await Promise.all(
    episodeNumbers.map(async (episodeNumber) => {
      const episodeAttributes: EpisodeAttributes | null = await models.Episode.findOne({
        where: {
          seasonId: seasonId,
          episodeNumber: episodeNumber,
        },
      });
      if (!episodeAttributes) {
        logger.error(`Episode with seasonId: ${seasonId} and episodeNumber: ${episodeNumber} not found`);
      }
      return episodeAttributes!.episodeId;
    })
  );
  return episodeIds;
}

async function getEpisodeBySeasonAndEpisodeNumber(
  season: number,
  episodeNumber: number
): Promise<EpisodeAttributes | null> {
  const episodeAttributes: EpisodeAttributes | null = await models.Episode.findOne({
    where: {
      seasonId: season,
      episodeNumber: episodeNumber,
    },
  });

  return episodeAttributes;
}

async function getEpisodesBySeason(season: number): Promise<EpisodeAttributes[]> {
  const episodesAttributes: EpisodeAttributes[] = await models.Episode.findAll({
    where: {
      seasonId: season,
    },
  });

  return episodesAttributes;
}

async function getEpisodeByEpisodeId(episodeId: string): Promise<EpisodeAttributes | null> {
  const episodeAttributes: EpisodeAttributes | null = await models.Episode.findOne({
    where: {
      episodeId: episodeId,
    },
  });

  return episodeAttributes;
}

export default episodeRepository;
