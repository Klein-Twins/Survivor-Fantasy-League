import { models } from '../../config/db';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonEliminationAttributes } from '../../models/season/SeasonEliminations';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import episodeRepository from './episode/episodeRepository';
import { InternalServerError } from '../../utils/errors/errors';

const seasonEliminationRepository = {
  getSeasonEliminationForSurvivorOnSeason,
  getEliminationStatusForSurvivorsByStartOfEpisode,
  getEliminationStatus,
};

async function getEliminationStatus(
  survivorId: SurvivorsAttributes['id'],
  episodeId: EpisodeAttributes['id']
): Promise<SeasonEliminationAttributes | null> {
  const episodeAttributes = await episodeRepository.getEpisode(
    'episodeId',
    episodeId
  );
  if (!episodeAttributes) {
    throw new Error(`Episode not found for episodeId: ${episodeId}`);
  }
  const seasonId = episodeAttributes.seasonId;

  const seasonEliminationsAttributes = await models.SeasonEliminations.findAll({
    where: {
      seasonId,
    },
    order: [['day', 'ASC']],
  });

  const eliminationsSoFar: SeasonEliminationAttributes[] = [];

  for (const seasonEliminationAttributes of seasonEliminationsAttributes) {
    const seasonEliminationEpisodeAttributes =
      await episodeRepository.getEpisode(
        'episodeId',
        seasonEliminationAttributes.episodeId
      );
    if (!seasonEliminationEpisodeAttributes) {
      throw new InternalServerError(
        `Episode not found for episodeId: ${seasonEliminationAttributes.episodeId}`
      );
    }
    const episodeNumberOfElimination =
      seasonEliminationEpisodeAttributes.number;

    if (episodeAttributes.number > episodeNumberOfElimination) {
      eliminationsSoFar.push(seasonEliminationAttributes);
    }
  }

  const survivorElimination = eliminationsSoFar.find((elimination) => {
    return elimination.survivorId === survivorId;
  });

  return survivorElimination || null;
}

async function getEliminationStatusForSurvivorsByStartOfEpisode(
  survivorIds: SurvivorsAttributes['id'][],
  seasonId: SeasonsAttributes['seasonId'],
  episodeId: EpisodeAttributes['id']
): Promise<
  Record<SurvivorsAttributes['id'], SeasonEliminationAttributes | null>
> {
  const seasonEliminationsAttributes = await models.SeasonEliminations.findAll({
    where: {
      seasonId,
    },
    order: [['day', 'ASC']],
  });

  const seasonEliminationIndex = seasonEliminationsAttributes.findIndex(
    (seasonEliminationAttributes) =>
      seasonEliminationAttributes.episodeId === episodeId
  );

  if (seasonEliminationIndex === -1) {
    // Return a record where each survivorId maps to null
    return survivorIds.reduce((acc, survivorId) => {
      acc[survivorId] =
        seasonEliminationsAttributes.find(
          (seasonEliminationAttributes) =>
            seasonEliminationAttributes.survivorId === survivorId
        ) || null;
      return acc;
    }, {} as Record<SurvivorsAttributes['id'], SeasonEliminationAttributes | null>);
  }

  // Truncate seasonEliminationsAttributes from 0 to seasonEliminationIndex (exclusive)
  const truncatedSeasonEliminations = seasonEliminationsAttributes.slice(
    0,
    seasonEliminationIndex
  );

  // Create a record where each survivorId maps to its eliminationAttributes
  return survivorIds.reduce((acc, survivorId) => {
    acc[survivorId] =
      truncatedSeasonEliminations.find(
        (seasonEliminationAttributes) =>
          seasonEliminationAttributes.survivorId === survivorId
      ) || null;
    return acc;
  }, {} as Record<SurvivorsAttributes['id'], SeasonEliminationAttributes | null>);
}

async function getSeasonEliminationForSurvivorOnSeason(
  survivorId: SurvivorsAttributes['id'],
  seasonId: SeasonsAttributes['seasonId']
): Promise<SeasonEliminationAttributes | null> {
  const seasonEliminationAttributes = await models.SeasonEliminations.findOne({
    where: {
      survivorId,
      seasonId,
    },
  });
  return seasonEliminationAttributes;
}

async function getSurvivorEliminatedOnEpisode(
  episodeId: EpisodeAttributes['id']
): Promise<
  (SurvivorDetailsOnSeasonAttributes & { Survivor: SurvivorsAttributes }) | null
> {
  const eliminatedSurvivor = (await models.SeasonEliminations.findOne({
    where: {
      episodeId, // Match the given episode
    },
    include: [
      {
        model: models.SurvivorDetailsOnSeason,
        as: 'survivor',
        include: [
          {
            required: true,
            model: models.Survivors,
            as: 'Survivor',
          },
        ],
      },
    ],
  })) as unknown as
    | (SurvivorDetailsOnSeasonAttributes & {
        Survivor: SurvivorsAttributes;
      })
    | null;

  return eliminatedSurvivor;
}

export default seasonEliminationRepository;
