import { Episode } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import episodeRepository from '../../repositories/season/episode/episodeRepository';
import { InternalServerError, NotFoundError } from '../../utils/errors/errors';

const episodeService = {
  getEpisodesBySeasonId,
  getEpisode,
  getAllEpisodesInSeason,
  getPremierEpisodeInSeason,
};

async function getPremierEpisodeInSeason(
  seasonId: EpisodeAttributes['seasonId']
): Promise<Episode> {
  const episodeAttributes: EpisodeAttributes | null =
    await episodeRepository.getPremierEpisodeInSeason(seasonId);
  if (!episodeAttributes) {
    throw new NotFoundError('Premier Episode not found for season');
  }
  return buildEpisode(episodeAttributes);
}

async function getAllEpisodesInSeason(
  seasonId: EpisodeAttributes['seasonId']
): Promise<Map<EpisodeAttributes['episodeId'], Episode>> {
  const episodesAttributes: EpisodeAttributes[] =
    await episodeRepository.getAllEpisodesInSeason(seasonId);

  const episodeMap = new Map<EpisodeAttributes['episodeId'], Episode>();
  for (const episodeAttributes of episodesAttributes) {
    episodeMap.set(
      episodeAttributes.episodeId,
      buildEpisode(episodeAttributes)
    );
  }
  return episodeMap;
}

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
  } else if (field === 'seasonIdAndEpisodeId') {
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
  const hasAired = new Date(episodeAttributes.episodeAirDate) < new Date();

  return {
    id: episodeAttributes.episodeId,
    number: episodeAttributes.episodeNumber,
    seasonId: episodeAttributes.seasonId,
    airDate: episodeAttributes.episodeAirDate.toString(),
    description: episodeAttributes.episodeDescription,
    title: episodeAttributes.episodeTitle,
    episodeType: episodeAttributes.episodeType,
    hasAired,
    isTribeSwitch: episodeAttributes.isTribeSwitch || false,
  };
}

export default episodeService;
