import { models } from '../../../config/db';
import { EpisodeType } from '../../../generated-api';
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
        type: EpisodeType.PREMIERE,
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
  value: EpisodeAttributes['id']
): Promise<EpisodeAttributes | null>;
async function getEpisode(
  field: 'seasonIdAndEpisodeNumber',
  value: {
    seasonId: EpisodeAttributes['seasonId'];
    episodeNumber: EpisodeAttributes['number'];
  }
): Promise<EpisodeAttributes | null>;
async function getEpisode(
  field: 'seasonIdAndEpisodeId',
  value: {
    seasonId: EpisodeAttributes['seasonId'];
    episodeId: EpisodeAttributes['id'];
  }
): Promise<EpisodeAttributes | null>;
async function getEpisode(
  field: 'episodeId' | 'seasonIdAndEpisodeNumber' | 'seasonIdAndEpisodeId',
  value:
    | EpisodeAttributes['id']
    | {
        seasonId: EpisodeAttributes['seasonId'];
        episodeNumber: EpisodeAttributes['number'];
      }
    | {
        seasonId: EpisodeAttributes['seasonId'];
        episodeId: EpisodeAttributes['id'];
      }
): Promise<EpisodeAttributes | null> {
  let episodeAttributes: EpisodeAttributes | null = null;

  if (field === 'seasonIdAndEpisodeNumber') {
    const { seasonId, episodeNumber } = value as {
      seasonId: EpisodeAttributes['seasonId'];
      episodeNumber: EpisodeAttributes['number'];
    };
    episodeAttributes = await models.Episode.findOne({
      where: {
        seasonId: seasonId,
        number: episodeNumber,
      },
    });
  } else if (field === 'seasonIdAndEpisodeId') {
    const { seasonId, episodeId } = value as {
      seasonId: EpisodeAttributes['seasonId'];
      episodeId: EpisodeAttributes['id'];
    };
    episodeAttributes = await models.Episode.findOne({
      where: {
        seasonId: seasonId,
        id: episodeId,
      },
    });
  } else if (field === 'episodeId') {
    episodeAttributes = await models.Episode.findOne({
      where: {
        id: value as EpisodeAttributes['id'],
      },
    });
  } else {
    throw new InternalServerError('Invalid field to get episode');
  }

  return episodeAttributes;
}

export default episodeRepository;
