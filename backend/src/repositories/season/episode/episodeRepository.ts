import { models } from '../../../config/db';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { InternalServerError } from '../../../utils/errors/errors';

const episodeRepository = {
  getEpisodesBySeasonId,
  getEpisode,
  getAllEpisodesInSeason,
  getPremierEpisodeInSeason,
};

async function getPremierEpisodeInSeason(
  seasonId: SeasonsAttributes['seasonId']
): Promise<EpisodeAttributes | null> {
  const episodeAttributes: EpisodeAttributes | null =
    await models.Episode.findOne({
      where: {
        seasonId: seasonId,
        episodeType: 'PREMIERE',
      },
    });
  return episodeAttributes;
}

async function getAllEpisodesInSeason(
  seasonId: SeasonsAttributes['seasonId']
): Promise<EpisodeAttributes[]> {
  const episodeAttributes: EpisodeAttributes[] = await models.Episode.findAll({
    where: {
      seasonId: seasonId,
    },
  });
  return episodeAttributes;
}

async function getEpisodesBySeasonId(
  seasonId: SeasonsAttributes['seasonId']
): Promise<EpisodeAttributes[]> {
  const episodeAttributes: EpisodeAttributes[] = await models.Episode.findAll({
    where: {
      seasonId: seasonId,
    },
  });
  return episodeAttributes;
}

async function getEpisode(
  field: 'episodeId',
  value: EpisodeAttributes['episodeId']
): Promise<EpisodeAttributes | null>;
async function getEpisode(
  field: 'seasonIdAndEpisodeNumber',
  value: {
    seasonId: EpisodeAttributes['seasonId'];
    episodeNumber: EpisodeAttributes['episodeNumber'];
  }
): Promise<EpisodeAttributes | null>;
async function getEpisode(
  field: 'seasonIdAndEpisodeId',
  value: {
    seasonId: EpisodeAttributes['seasonId'];
    episodeId: EpisodeAttributes['episodeId'];
  }
): Promise<EpisodeAttributes | null>;
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
): Promise<EpisodeAttributes | null> {
  let episodeAttributes: EpisodeAttributes | null = null;

  if (field === 'seasonIdAndEpisodeNumber') {
    const { seasonId, episodeNumber } = value as {
      seasonId: EpisodeAttributes['seasonId'];
      episodeNumber: EpisodeAttributes['episodeNumber'];
    };
    episodeAttributes = await models.Episode.findOne({
      where: {
        seasonId: seasonId,
        episodeNumber: episodeNumber,
      },
    });
  } else if (field === 'seasonIdAndEpisodeId') {
    const { seasonId, episodeId } = value as {
      seasonId: EpisodeAttributes['seasonId'];
      episodeId: EpisodeAttributes['episodeId'];
    };
    episodeAttributes = await models.Episode.findOne({
      where: {
        seasonId: seasonId,
        episodeId: episodeId,
      },
    });
  } else if (field === 'episodeId') {
    episodeAttributes = await models.Episode.findOne({
      where: {
        episodeId: value as EpisodeAttributes['episodeId'],
      },
    });
  } else {
    throw new InternalServerError('Invalid field to get episode');
  }

  return episodeAttributes;
}

export default episodeRepository;
