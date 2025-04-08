import { models } from '../../config/db';
import { SurvivorBasic } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonEliminationAttributes } from '../../models/season/SeasonEliminations';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';

const seasonEliminationRepository = {
  getSeasonEliminationForSurvivorOnSeason,
  getEliminationStatusForSurvivorsByStartOfEpisode,
};

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
