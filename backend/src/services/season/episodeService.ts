import { Episode } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import episodeRepository from '../../repositories/season/episode/episodeRepository';
import { InternalServerError, NotFoundError } from '../../utils/errors/errors';

const episodeService = {
  getEpisodesBySeasonId,
  getEpisode,
};

async function getEpisodesBySeasonId(
  seasonId: EpisodeAttributes['seasonId']
): Promise<Episode[]> {
  const episodesAttributes: EpisodeAttributes[] =
    await episodeRepository.getEpisodesBySeasonId(seasonId);
  const episodes: Episode[] = [];
  for (const episodeAttributes of episodesAttributes) {
    episodes.push(buildEpisode(episodeAttributes));
  }
  return episodes;
}

async function getEpisode(
  field: 'episodeId',
  value: EpisodeAttributes['episodeId']
): Promise<Episode>;
async function getEpisode(
  field: 'seasonIdAndEpisodeNumber',
  value: {
    seasonId: EpisodeAttributes['seasonId'];
    episodeNumber: EpisodeAttributes['episodeNumber'];
  }
): Promise<Episode>;
async function getEpisode(
  field: 'seasonIdAndEpisodeId',
  value: {
    seasonId: EpisodeAttributes['seasonId'];
    episodeId: EpisodeAttributes['episodeId'];
  }
): Promise<Episode>;

async function getEpisode(
  field: 'episodeId' | 'seasonIdAndEpisodeNumber' | 'seasonIdAndEpisodeId',
  value:
    | EpisodeAttributes['episodeId']
    | {
        seasonId: EpisodeAttributes['seasonId'];
        episodeNumber: EpisodeAttributes['episodeNumber'];
      }
    | {
        seasonId: EpisodeAttributes['seasonId'];
        episodeId: EpisodeAttributes['episodeId'];
      }
): Promise<Episode> {
  let episodeAttributes: EpisodeAttributes | null = null;

  if (field === 'seasonIdAndEpisodeNumber') {
    const { seasonId, episodeNumber } = value as {
      seasonId: EpisodeAttributes['seasonId'];
      episodeNumber: EpisodeAttributes['episodeNumber'];
    };
    episodeRepository.getEpisode(field, { seasonId, episodeNumber });
  } else if ((field = 'seasonIdAndEpisodeId')) {
    const { seasonId, episodeId } = value as {
      seasonId: EpisodeAttributes['seasonId'];
      episodeId: EpisodeAttributes['episodeId'];
    };
    episodeAttributes = await episodeRepository.getEpisode(field, {
      seasonId,
      episodeId,
    });
  } else if (field === 'episodeId') {
    const episodeId = value as EpisodeAttributes['episodeId'];
    episodeAttributes = await episodeRepository.getEpisode(field, episodeId);
  } else {
    throw new InternalServerError('Invalid field to get episode');
  }

  if (!episodeAttributes) {
    throw new NotFoundError('Episode not found');
  }
  return buildEpisode(episodeAttributes);
}

function buildEpisode(episodeAttributes: EpisodeAttributes): Episode {
  return {
    id: episodeAttributes.episodeId,
    number: episodeAttributes.episodeNumber,
    seasonId: episodeAttributes.seasonId,
    airDate: episodeAttributes.episodeAirDate.toString(),
    description: episodeAttributes.episodeDescription,
    title: episodeAttributes.episodeTitle,
  };
}

export default episodeService;
