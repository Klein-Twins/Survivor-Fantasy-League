import { Op, Sequelize } from 'sequelize';
import sequelize, { models } from '../../config/db';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { TribeAttributes } from '../../models/season/Tribes';
import episodeService from '../../services/season/episodeService';
import { NotImplementedError } from '../../utils/errors/errors';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';

const tribeRepository = {
  getTribesBySeasonId,
  getTribesOnEpisode,
  getStartingSurvivorsByTribeIds,
};

async function getStartingSurvivorsByTribeIds(
  tribeId: TribeAttributes['id']
): Promise<SurvivorsAttributes['id'][]> {
  const survivorIds = await models.SurvivorDetailsOnSeason.findAll({
    where: {
      originalTribeId: tribeId,
    },
  });
  return survivorIds.map((survivor) => survivor.id);
}

async function getTribesBySeasonId(
  seasonId: SeasonsAttributes['seasonId']
): Promise<TribeAttributes[]> {
  const tribesAttributes: TribeAttributes[] = await models.Tribe.findAll({
    where: {
      seasonId: seasonId,
    },
  });
  return tribesAttributes;
}

async function getTribesOnEpisode(
  episodeId: EpisodeAttributes['episodeId']
): Promise<TribeAttributes[]> {
  // Fetch the episode to get its episode number
  const episode = await episodeService.getEpisode('episodeId', episodeId);

  if (!episode) {
    throw new Error(`Episode with ID ${episodeId} not found`);
  }

  const episodeNumber = episode.number;

  // Fetch tribes and their members for the given episode
  const tribes = await models.Tribe.findAll({
    include: [
      {
        model: models.TribeMembers,
        as: 'tribeMembers',
        required: true,
        include: [
          {
            model: models.SurvivorDetailsOnSeason,
            as: 'survivor',
            required: true,
            include: [
              {
                model: models.Survivors,
                as: 'Survivor',
                attributes: ['firstName', 'lastName'], // Survivor details
              },
            ],
          },
          {
            model: models.Episode,
            as: 'episodeStarted',
            attributes: ['episodeNumber'], // Start episode details
            where: {
              episodeNumber: {
                [Op.lte]: episodeNumber, // Started on or before the given episode
              },
            },
          },
          {
            model: models.Episode,
            as: 'episodeEnded',
            attributes: ['episodeNumber'], // End episode details
            where: {
              [Op.or]: [
                { episodeNumber: { [Op.gte]: episodeNumber } }, // Ended after the given episode
                { episodeNumber: null }, // Still active
              ],
            },
          },
        ],
        where: {
          episodeIdEnd: {
            [Op.or]: [null, { [Op.ne]: null }], // Include members still in the tribe or with a valid end episode
          },
        },
      },
    ],
    where: {
      seasonId: '48', // Replace with dynamic seasonId if needed
    },
  });

  return tribes;
}

export default tribeRepository;
