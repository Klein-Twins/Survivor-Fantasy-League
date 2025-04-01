import { Op } from 'sequelize';
import { models } from '../../config/db';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { TribeAttributes } from '../../models/season/Tribes';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import episodeService from '../../services/season/episodeService';

const tribeMemberRepository = {
  getTribeMemberIds,
};
async function getTribeMemberIds(
  tribeId: TribeAttributes['id'],
  episodeId: EpisodeAttributes['episodeId']
): Promise<SurvivorsAttributes['id'][]> {
  // Fetch the episode to get its episode number
  const episode = await episodeService.getEpisode('episodeId', episodeId);

  if (!episode) {
    throw new Error(`Episode with ID ${episodeId} not found`);
  }

  const episodeNumber = episode.number;

  // Fetch tribe members for the given episode
  const tribeMemberAttributes = await models.TribeMembers.findAll({
    where: {
      tribeId, // Filter by the given tribe
    },
    include: [
      {
        model: models.Episode,
        as: 'episodeStarted',
        required: true,
        where: {
          episodeNumber: {
            [Op.lte]: episodeNumber, // Include survivors who joined on or before the given episode
          },
        },
      },
      {
        model: models.Episode,
        as: 'episodeEnded',
        required: false, // Allow survivors with no end episode (still in the tribe)
        where: {
          [Op.or]: [
            { episodeNumber: { [Op.gt]: episodeNumber } }, // Ended after the given episode
            { episodeNumber: null }, // Still in the tribe
          ],
        },
      },
    ],
  });

  // Filter out duplicates and ensure only valid records are returned
  const uniqueSurvivors = new Map<string, SurvivorsAttributes['id']>();

  tribeMemberAttributes.forEach(async (tribeMember) => {
    const survivorId = tribeMember.survivorId;
    const startEpisodeNumber = (
      await episodeService.getEpisode('episodeId', tribeMember.episodeIdStart)
    ).number;
    const endEpisodeNumber = tribeMember.episodeIdEnd
      ? (await episodeService.getEpisode('episodeId', tribeMember.episodeIdEnd))
          .number
      : Infinity;

    // Ensure the survivor is part of the tribe during the given episode
    if (
      startEpisodeNumber <= episodeNumber &&
      episodeNumber < endEpisodeNumber
    ) {
      uniqueSurvivors.set(survivorId, survivorId); // Use a Map to ensure uniqueness
    }
  });

  return Array.from(uniqueSurvivors.values());
}

export default tribeMemberRepository;
