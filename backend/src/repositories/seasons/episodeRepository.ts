import { models } from '../../config/db';
import { Episode } from '../../generated-api';
import episodeHelper from '../../helpers/season/episodeHelper';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { NotFoundError } from '../../utils/errors/errors';

const episodeRepository = {
  getEpisodeByEpisodeId,
  getEpisodeBySeasonAndEpisodeNumber,
};

// async function getEpisode(
//   episodeId: EpisodeAttributes['episodeId']
// ): Promise<Episode>;
// async function getEpisode(
//   seasonId: SeasonsAttributes['seasonId'],
//   episodeNumber: EpisodeAttributes['episodeNumber']
// ): Promise<Episode>;

async function getEpisodeByEpisodeId(
  episodeId: EpisodeAttributes['episodeId']
): Promise<Episode> {
  const episodeAttributes: EpisodeAttributes | null =
    await models.Episode.findOne({
      where: {
        episodeId: episodeId,
      },
    });

  if (!episodeAttributes) {
    throw new NotFoundError('Episode not found');
  }

  return episodeHelper.buildEpisode(episodeAttributes);
}

async function getEpisodeBySeasonAndEpisodeNumber(
  seasonId: SeasonsAttributes['seasonId'],
  episodeNumber: EpisodeAttributes['episodeNumber']
): Promise<Episode> {
  const episodeAttributes: EpisodeAttributes | null =
    await models.Episode.findOne({
      where: {
        seasonId: seasonId,
        episodeNumber: episodeNumber,
      },
    });

  if (!episodeAttributes) {
    throw new NotFoundError('Episode not found');
  }

  return episodeHelper.buildEpisode(episodeAttributes);
}

export default episodeRepository;
