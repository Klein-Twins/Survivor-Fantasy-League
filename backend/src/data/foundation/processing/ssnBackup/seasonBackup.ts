import { Op } from 'sequelize';
import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { SeasonsAttributes } from '../../../../models/season/Seasons';
import {
  Challenge,
  Episode,
  EpisodeInfo,
  SeasonData,
  StartingTribe,
  Tribes,
  TribeSwitch,
} from '../../data/ssn/dataTypes';
import survivorsData from '../../data/survivors/survivorsData';
import { TribeAttributes } from '../../../../models/season/Tribes';
import { SurvivorDetailsOnSeasonAttributes } from '../../../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../../../models/survivors/Survivors';
import { EpisodeAttributes } from '../../../../models/season/Episodes';

// export const seedSeasonTable = async <T extends string | number | symbol>(
//   seasonData: SeasonData<T>
// ) => {
//   logger.debug(
//     `Processing ${models.Seasons.tableName}: ${seasonData.seasonId}`
//   );

//   await models.Seasons.destroy({
//     where: {
//       seasonId: seasonData.seasonId,
//     },
//   });
//   await models.Seasons.create({
//     seasonId: seasonData.seasonId,
//     theme: seasonData.theme,
//     location: seasonData.location,
//     name: seasonData.name,
//     startDate: seasonData.startDate,
//     endDate: seasonData.endDate,
//     isActive: seasonData.isActive,
//   });
// };

// export const seedSurvivorsInSeason = async <T extends string | number | symbol>(
//   seasonData: SeasonData<T>
// ) => {
//   const allSurvivors = survivorsData;

//   const survivorsInSeason = allSurvivors.filter((survivor) => {
//     return survivor.seasonDetails?.get(seasonData.seasonId);
//   });

//   logger.debug(
//     `Processing ${survivorsInSeason.length} survivors in season ${seasonData.seasonId}`
//   );
//   await survivorsInSeason.forEach(async (survivor) => {
//     logger.debug(
//       `Processing ${models.Survivors.tableName}: ${survivor.firstName} ${survivor.lastName}`
//     );
//     const survivorAttributes = await models.Survivors.findOne({
//       where: { id: survivor.id },
//     });
//     if (!survivorAttributes) {
//       logger.debug(
//         `${models.Survivors.tableName}: Survivor ${survivor.firstName} ${survivor.lastName} created`
//       );
//       await models.Survivors.create({
//         id: survivor.id,
//         firstName: survivor.firstName,
//         nickName: survivor.nickName,
//         lastName: survivor.lastName,
//         fromCity: survivor.fromCity,
//         fromState: survivor.fromState,
//         fromCountry: survivor.fromCountry,
//       });
//     } else {
//       logger.debug(
//         `${models.Survivors.tableName}: Survivor ${survivor.firstName} ${survivor.lastName} already exists`
//       );
//     }

//     logger.debug(
//       `Processing ${models.SurvivorDetailsOnSeason.tableName}: ${survivor.firstName} ${survivor.lastName}`
//     );
//     await models.SurvivorDetailsOnSeason.destroy({
//       where: {
//         seasonId: seasonData.seasonId,
//         id: survivor.id,
//       },
//     });
//     const survivorDetails = survivor.seasonDetails?.get(seasonData.seasonId);
//     await models.SurvivorDetailsOnSeason.create({
//       id: survivor.id,
//       seasonId: seasonData.seasonId,
//       age: survivorDetails!.age,
//       description: survivorDetails!.description,
//       job: survivorDetails!.job,
//     });
//   });
// };

export async function seedStartingTribes<T extends string | number | symbol>(
  seasonData: SeasonData<T>
) {
  logger.debug(
    `${models.Tribe.tableName}: Processing starting tribes for season: ${seasonData.seasonId}`
  );

  const deleted = await models.Tribe.destroy({
    where: {
      seasonId: seasonData.seasonId,
      mergeTribe: false,
    },
  });

  logger.debug(
    `Deleted ${deleted} tribes from ${models.Tribe.tableName} for season: ${seasonData.seasonId} before seeding.`
  );

  await seedOriginalTribes(
    seasonData.seasonId,
    Array.from(seasonData.tribes.values())
  );
}

export async function processEpisodes<T extends string | number | symbol>(
  seasonData: SeasonData<T>
) {
  const deleted = await models.Episode.destroy({
    where: {
      seasonId: seasonData.seasonId,
    },
  });
  logger.debug(
    `Deleted ${deleted} episodes from ${models.Episode.tableName} for season: ${seasonData.seasonId} before seeding.`
  );

  for (const episode of seasonData.episodes.values()) {
    if (episode.episodeInfo.number === 1) {
      await processEpisode(
        seasonData.seasonId,
        episode,
        Array.from(seasonData.tribes.values())
      );
    } else {
      await processEpisode(seasonData.seasonId, episode);
    }
  }
}

export async function processEpisode(
  seasonNumber: SeasonsAttributes['seasonId'],
  episode: Episode,
  tribes?: StartingTribe[]
) {
  logger.debug(
    `Processing episode: ${episode.episodeInfo.number} for season: ${seasonNumber}`
  );
  const createdEpisode = await models.Episode.create({
    id: episode.episodeInfo.id,
    seasonId: seasonNumber,
    number: episode.episodeInfo.number,
    title: episode.episodeInfo.title,
    airDate: episode.episodeInfo.airDate,
    description: episode.episodeInfo.description,
    type: episode.episodeInfo.type,
  });
  logger.debug(
    `${models.Episode.tableName} Created episode: ${createdEpisode.number} for season: ${seasonNumber}`
  );

  if (createdEpisode.number === 1) {
    if (!tribes) {
      throw new Error('Tribes are required for the first episode');
    }
    await seedOriginalTribes(seasonNumber, tribes);
  }

  await processEpisodeEvents(seasonNumber, episode);
}

async function processEpisodeEvents(
  seasonId: SeasonsAttributes['seasonId'],
  episode: Episode
) {
  logger.debug(
    `Processing episode events for episode: ${episode.episodeInfo.number}`
  );

  if (episode.episodeEvents?.tribeSwitch) {
    await processTribeSwitch(
      episode.episodeInfo.id,
      episode.episodeEvents.tribeSwitch
    );
  }

  if (episode.episodeEvents?.isMerge) {
    await processMergeEpisode(seasonId, episode);
  }

  await processEpisodeElimination(seasonId, episode);

  await processChallenges(episode);
}

async function processMergeEpisode(
  seasonId: SeasonsAttributes['seasonId'],
  episode: Episode
) {
  logger.debug(
    `Processing merge episode for episode: ${episode.episodeInfo.number}`
  );

  const nonMergeTribes = await models.Tribe.findAll({
    where: {
      seasonId: seasonId,
      mergeTribe: false,
    },
  });

  await models.TribeMembers.update(
    {
      episodeIdEnd: episode.episodeInfo.id,
    },
    {
      where: {
        [Op.and]: [
          {
            episodeIdEnd: null,
          },
          {
            tribeId: {
              [Op.in]: nonMergeTribes.map((tribe) => tribe.id),
            },
          },
        ],
      },
    }
  );
}

async function processEpisodeElimination(
  seasonId: SeasonsAttributes['seasonId'],
  episode: Episode
) {
  await models.SeasonEliminations.destroy({
    where: {
      episodeId: episode.episodeInfo.id,
    },
  });

  episode.episodeEvents?.eliminatedSurvivors.forEach(
    async (eliminatedSurvivor) => {
      const survivorAttributes = await models.Survivors.findByPk(
        eliminatedSurvivor.survivorId
      );

      if (!survivorAttributes) {
        throw new Error(
          `Survivor with ID ${eliminatedSurvivor.survivorId} not found`
        );
      }
      const survivorName = `${survivorAttributes.firstName} ${survivorAttributes.lastName}`;

      logger.debug(
        `Processing elimination: ${survivorName} for episode: ${episode.episodeInfo.number}`
      );

      await models.SeasonEliminations.create({
        seasonId: seasonId,
        day: eliminatedSurvivor.day,
        survivorId: eliminatedSurvivor.survivorId,
        episodeId: episode.episodeInfo.id,
        placement: eliminatedSurvivor.placement,
        notes: eliminatedSurvivor.notes,
        seq: eliminatedSurvivor.seq,
      });
    }
  );
}

async function processChallenges(episode: Episode) {
  async function processChallenge(
    episodeInfo: EpisodeInfo,
    challenge: Challenge
  ) {
    logger.debug(
      `Processing challenge: ${challenge.rank} (${challenge.type}) for episode: ${episodeInfo.number}`
    );

    const createdChallenge = await models.Challenges.create({
      id: challenge.id,
      episodeId: episodeInfo.id,
      type: challenge.type,
      description: challenge.description,
      rank: challenge.rank,
      notes: challenge.notes,
    });

    const challengeWinners = challenge.results.forEach(async (result) => {
      let winnerName = null;
      if (result.winnerSurvivorId) {
        winnerName = await models.Survivors.findOne({
          where: {
            id: result.winnerSurvivorId,
          },
        }).then((survivor) => survivor?.firstName);
      } else if (result.winnerTribeId) {
        winnerName = await models.Tribe.findOne({
          where: {
            id: result.winnerTribeId,
          },
        }).then((tribe) => tribe?.name);
      } else {
        logger.error(`Challenge winner does not have a tribe or survivor id`);
        return;
      }

      logger.debug(
        `Processing challenge ${result.rank} winner: ${result.winnerType} | ${
          result.winnerSurvivorId
            ? result.winnerSurvivorId
            : result.winnerTribeId
        } for episode: ${episode.episodeInfo.number}`
      );

      await models.ChallengeWinners.create({
        challengeId: createdChallenge.id,
        winnerSurvivorId: result.winnerSurvivorId,
        winnerTribeId: result.winnerTribeId,
        rank: result.rank,
        reward: result.reward,
        winnerType: result.winnerType,
        winnerNotes: result.winnerNotes,
      });
    });
  }

  await models.Challenges.destroy({
    where: {
      episodeId: episode.episodeInfo.id,
    },
  });

  episode.episodeEvents?.challenges.forEach(async (challenge) => {
    await processChallenge(episode.episodeInfo, challenge);
  });
}

async function processTribeSwitch(
  episodeId: EpisodeAttributes['id'],
  tribeSwitch: TribeSwitch
) {
  const episodeAttributes = await models.Episode.findByPk(episodeId);
  if (!episodeAttributes) {
    throw new Error(`Episode with ID ${episodeId} not found`);
  }
  const { number: episodeNumber, seasonId } = episodeAttributes;
  logger.debug(
    `Processing tribe switch for episode: ${episodeNumber} for season: ${seasonId}`
  );

  const deleted = await models.TribeMembers.destroy({
    where: {
      episodeIdStart: episodeId,
    },
  });

  tribeSwitch.forEach(async (tribeSwitch) => {
    const survivorAttributes = await models.Survivors.findByPk(
      tribeSwitch.survivorId
    );
    if (!survivorAttributes) {
      throw new Error(`Survivor with ID ${tribeSwitch.survivorId} not found`);
    }
    const survivorName = `${survivorAttributes.firstName} ${survivorAttributes.lastName}`;

    const tribeAttributes = await models.Tribe.findByPk(tribeSwitch.tribeId);
    if (!tribeAttributes) {
      throw new Error(`Tribe with ID ${tribeSwitch.tribeId} not found`);
    }
    const tribeName = tribeAttributes.name;

    await models.TribeMembers.update(
      {
        episodeIdEnd: episodeId,
      },
      {
        where: {
          survivorId: tribeSwitch.survivorId,
          episodeIdEnd: null,
        },
      }
    );

    await models.TribeMembers.create({
      survivorId: tribeSwitch.survivorId,
      tribeId: tribeSwitch.tribeId,
      episodeIdStart: episodeId,
      episodeIdEnd: null,
      notes: `${survivorName} switched to tribe ${tribeSwitch.tribeId}`,
    });

    logger.debug(
      `Successfully processed tribe switch for survivor: ${survivorName} to tribe: ${tribeName} for episode: ${episodeNumber}`
    );
  });
}

async function seedOriginalTribes<T extends string | number | symbol>(
  seasonId: SeasonsAttributes['seasonId'],
  tribes: StartingTribe[]
) {
  logger.debug(
    `${models.Tribe.tableName}: Processing starting tribes for season: ${seasonId}`
  );

  const deleted = await models.Tribe.destroy({
    where: {
      seasonId: seasonId,
      mergeTribe: false,
    },
  });

  logger.debug(
    `Deleted ${deleted} tribes from ${models.Tribe.tableName} for season: ${seasonId} before seeding.`
  );
  tribes.forEach(async (tribe) => {
    logger.debug('Creating starting tribe: ', tribe.name);

    const createdTribe = await models.Tribe.create({
      id: tribe.id,
      seasonId: seasonId,
      name: tribe.name,
      color: tribe.color,
      hexColor: tribe.hexColor,
      mergeTribe: tribe.mergeTribe,
      episodeIdStart: tribe.episodeIdStart,
      episodeIdEnd: null,
    });

    for (const survivorId of tribe.startingSurvivors) {
      const survivorAttributes = await models.Survivors.findByPk(survivorId);
      if (!survivorAttributes) {
        throw new Error(`Survivor with ID ${survivorId} not found`);
      }
      const survivorName = `${survivorAttributes.firstName} ${survivorAttributes.lastName}`;

      logger.debug(
        `${models.TribeMembers.tableName} Processing tribe member: ${survivorName} for tribe: ${createdTribe.name}`
      );

      const notes = `${
        survivorsData.find((survivor) => survivor.id === survivorId)?.firstName
      } started on ${createdTribe.name}`;

      const createdTribeMemberRecord = await models.TribeMembers.create({
        survivorId: survivorId,
        tribeId: createdTribe.id,
        episodeIdStart: createdTribe.episodeIdStart,
        episodeIdEnd: null,
        notes: notes,
      });

      logger.debug(
        `Successfully created tribe member: ${survivorName} for tribe: ${createdTribe.name}`
      );
    }

    const tribeWithTribemembers = (await models.Tribe.findByPk(
      createdTribe.id,
      {
        include: [
          {
            required: true,
            model: models.TribeMembers,
            as: 'tribeMembers',
            include: [
              {
                required: true,
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
          },
        ],
      }
    )) as unknown as TribeAttributes & {
      tribeMembers: (TribeAttributes & {
        survivor: SurvivorDetailsOnSeasonAttributes & {
          Survivor: SurvivorsAttributes;
        };
      })[];
    };

    const tribeMemberNames = tribeWithTribemembers.tribeMembers.map(
      (tribeMember) =>
        `${tribeMember.survivor.Survivor.firstName} ${tribeMember.survivor.Survivor.lastName}`
    );

    logger.debug(
      `Successfully created tribe: ${
        createdTribe.name
      } with tribeMembers: ${tribeMemberNames.join(', ')}`
    );
  });
}
