import { Op, Transaction } from 'sequelize';
import { models } from '../../config/db';
import { Episode } from '../../generated-api';
import episodeHelper from '../../helpers/season/episodeHelper';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { NotFoundError } from '../../utils/errors/errors';
import { v4 as uuidv4 } from 'uuid';

const episodeRepository = {
  getEpisodeByEpisodeId,
  getEpisodeBySeasonAndEpisodeNumber,
  createEpisode,
  getEpisodesBySeasonId,
  getUpcomingEpisode,
};

// async function getEpisode(
//   episodeId: EpisodeAttributes['episodeId']
// ): Promise<Episode>;
// async function getEpisode(
//   seasonId: SeasonsAttributes['seasonId'],
//   episodeNumber: EpisodeAttributes['episodeNumber']
// ): Promise<Episode>;

async function getUpcomingEpisode(
  seasonId: SeasonsAttributes['seasonId'],
  currentTime: Date
) {
  const episodeAttributes: EpisodeAttributes | null =
    await models.Episode.findOne({
      where: {
        episodeAirDate: {
          [Op.gt]: currentTime,
          seasonId: seasonId,
        },
      },
      order: [['episodeAirDate', 'ASC']],
    });

  if (!episodeAttributes) {
    return null;
  }

  return episodeHelper.buildEpisode(episodeAttributes);
}

async function createEpisode(
  seasonId: SeasonsAttributes['seasonId'],
  episodeNumber: EpisodeAttributes['episodeNumber'],
  episodeAirDate: EpisodeAttributes['episodeAirDate'],
  transaction?: Transaction
): Promise<EpisodeAttributes> {
  let t = transaction;
  if (!transaction) {
    t = await models.sequelize.transaction();
  }
  try {
    const episodeId = uuidv4();
    const episodeAttributes: EpisodeAttributes = await models.Episode.create({
      seasonId: seasonId,
      episodeId: episodeId,
      episodeNumber: episodeNumber,
      episodeTitle: null,
      episodeAirDate: episodeAirDate,
      episodeDescription: null,
    });
    return episodeAttributes;
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

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

export default episodeRepository;
