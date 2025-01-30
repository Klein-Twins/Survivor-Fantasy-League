import { models } from '../../config/db';
import { EpisodeAttributes } from '../../models/season/SSN_EPISODES';

const episodeRepository = {
  getEpisodeBySeasonAndEpisodeNumber,
  getEpisodesBySeason,
  getEpisodeByEpisodeId,
};

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
