import { models } from '../../config/db';
import { SurvivorBasic } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { TribeMemberAttributes } from '../../models/season/TribeMembers';
import { TribeAttributes } from '../../models/season/Tribes';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import episodeService from '../../servicesBackup/season/episodeService';
import tribeRepository from './tribeRepository';
// import seasonEliminationService from '../../services/season/seasonEliminationService';
import { InternalServerError } from '../../utils/errors/errors';
import episodeRepository from './episode/episodeRepository';
import { Op, Transaction } from 'sequelize';

export type TribeMemberQueryResult = Pick<
  TribeMemberAttributes,
  'episodeIdStart' | 'episodeIdEnd' | 'notes'
> & {
  tribe: TribeAttributes;
  survivor: {
    id: SurvivorsAttributes['id'];
    firstName: SurvivorsAttributes['firstName'];
    lastName: SurvivorsAttributes['lastName'];
  };
};

type EliminatedSurvivorQueryResult = {
  survivor: {
    id: SurvivorsAttributes['id'];
    firstName: SurvivorsAttributes['firstName'];
    lastName: SurvivorsAttributes['lastName'];
  };
};

type TribeWithMembers = {
  tribe: TribeAttributes;
  survivors: SurvivorBasic[];
};

const tribeMemberRepository = {
  fetchTribeHistory,
  getTribeIdSurvivorBelongsToAtStartOfEpisode,
  removeEliminatedSurvivorFromTribe,
};

async function removeEliminatedSurvivorFromTribe(
  survivorId: SurvivorsAttributes['id'],
  episodeId: EpisodeAttributes['id'],
  transaction?: Transaction
) {
  const episode = await episodeService.getEpisode('episodeId', episodeId);
  const seasonId = episode.seasonId;
  const tribeIdsOnSeason = (
    await tribeRepository.getTribesBySeasonId(seasonId)
  ).map((tribeAttributes) => tribeAttributes.id);
  let t = transaction;
  if (!t) {
    t = await models.sequelize.transaction();
  }
  try {
    await models.TribeMembers.update(
      {
        episodeIdEnd: episodeId,
      },
      {
        where: {
          survivorId: survivorId,
          episodeIdEnd: { [Op.is]: null },
          tribeId: { [Op.in]: tribeIdsOnSeason },
        },
        transaction: t,
      }
    );

    if (!transaction && t) {
      await t.commit();
    }
  } catch (error) {
    if (t && !transaction) {
      await t.rollback();
    }
    throw error;
  }
}

async function getTribeIdSurvivorBelongsToAtStartOfEpisode(
  survivorId: SurvivorsAttributes['id'],
  episodeId: EpisodeAttributes['id']
): Promise<TribeAttributes['id'] | null> {
  // if (
  //   await seasonEliminationService
  //     .getSurvivorEliminationStatusAtStartOfEpisode(survivorId, episodeId)
  //     .then((eliminationStatus) => eliminationStatus.isEliminated)
  // ) {
  //   return null;
  // }

  const episodeAttributes = await episodeRepository.getEpisode(
    'episodeId',
    episodeId
  );
  if (!episodeAttributes) {
    throw new InternalServerError('Episode not found');
  }

  const tribesInSeason = (
    await tribeRepository.getTribesBySeasonId(episodeAttributes.seasonId)
  ).map((tribeAttributes) => tribeAttributes.id);

  const survivorsCompleteTribeHistory = await models.TribeMembers.findAll({
    where: {
      survivorId: survivorId,
      tribeId: { [Op.in]: tribesInSeason },
    },
  });

  for (const survivorCompleteTribeHistory of survivorsCompleteTribeHistory) {
    const isEliminatedSurvivor = await models.SeasonEliminations.findOne({
      where: {
        survivorId: survivorCompleteTribeHistory.survivorId,
      },
    });

    if (!!isEliminatedSurvivor) {
      survivorsCompleteTribeHistory.splice(
        survivorsCompleteTribeHistory.indexOf(survivorCompleteTribeHistory),
        1
      );
    }
  }

  async function filterTribeHistory(
    episodeNumber: EpisodeAttributes['number'],
    survivorsCompleteTribeHistory: TribeMemberAttributes[]
  ): Promise<TribeMemberAttributes | void> {
    for (const survivorTribeHistory of survivorsCompleteTribeHistory) {
      const startEpisodeNumber = await episodeRepository
        .getEpisode('episodeId', survivorTribeHistory.episodeIdStart)
        .then((episode) => episode!.number);
      const endEpisodeNumber = survivorTribeHistory.episodeIdEnd
        ? await episodeRepository
            .getEpisode('episodeId', survivorTribeHistory.episodeIdEnd)
            .then((episode) => episode!.number)
        : null;

      if (episodeNumber > startEpisodeNumber) {
        if (endEpisodeNumber === null) {
          return survivorTribeHistory;
        } else {
          if (episodeNumber < endEpisodeNumber) {
            return survivorTribeHistory;
          } else if (episodeNumber === endEpisodeNumber) {
            return survivorTribeHistory;
          } else if (episodeNumber > endEpisodeNumber) {
            continue;
          }
        }
      } else if (episodeNumber < startEpisodeNumber) {
        continue;
      } else if (episodeNumber === startEpisodeNumber) {
        if (episodeNumber === 1) {
          return survivorTribeHistory;
        }
        continue;
      }
      throw new InternalServerError(
        `Encountered a weird condition for survivor ${survivorId} on episode ${episodeNumber} with start episode ${startEpisodeNumber} and end episode ${endEpisodeNumber}`
      );

      // if (startEpisodeNumber > episodeNumber) {
      //   if (endEpisodeNumber === null) {
      //     return survivorTribeHistory;
      //   } else {
      //     if (endEpisodeNumber >= episodeNumber) {
      //       return survivorTribeHistory;
      //     }
      //     continue;
      //   }
      // } else if (startEpisodeNumber === episodeNumber) {
      //   if (episodeNumber === 1) {
      //     return survivorTribeHistory;
      //   }
      //   continue;
      // } else if (endEpisodeNumber) {
      //   continue;
      // } else {
      //   throw new InternalServerError(
      //     `Encountered a weird condition for survivor ${survivorId} on episode ${episodeNumber} with start episode ${startEpisodeNumber} and end episode ${endEpisodeNumber}`
      //   );
    }

    // if (episodeNumber === 1 && startEpisodeNumber === 1) {
    //   return survivorTribeHistory;
    // } else if (
    //   episodeNumber > startEpisodeNumber &&
    //   endEpisodeNumber &&
    //   episodeNumber <= endEpisodeNumber!
    // ) {
    //   return survivorTribeHistory;
    // } else if (episodeNumber > startEpisodeNumber && !endEpisodeNumber) {
    //   return survivorTribeHistory;
    // } else if (endEpisodeNumber && episodeNumber > endEpisodeNumber) {
    //   continue;
    // }
    // if (episodeNumber < startEpisodeNumber) {
    //   continue;
    // } else {
    //   throw new InternalServerError(
    //     `Encountered a weird condition for survivor ${survivorId} on episode ${episodeNumber} with start episode ${startEpisodeNumber} and end episode ${endEpisodeNumber}`
    //   );
    // }
    // }
    // throw new InternalServerError('No tribe history found');
  }

  const currentTribe = await filterTribeHistory(
    episodeAttributes.number,
    survivorsCompleteTribeHistory
  );

  return currentTribe?.tribeId || null;
}

//This function fetches all tribe members for a given tribe with switches throughout their season. Hence, it needs to be filtered
async function fetchTribeHistory(
  tribeId: TribeAttributes['id']
): Promise<TribeMemberQueryResult[]> {
  const tribeMembersAttributes = (await models.TribeMembers.findAll({
    where: {
      tribeId, // Filter by the given tribe
    },
    include: [
      {
        required: true,
        model: models.Tribe,
        as: 'tribe',
        attributes: ['id', 'name'], // Include tribe details
      },
      {
        required: true,
        model: models.SurvivorDetailsOnSeason,
        as: 'survivor',
        include: [
          {
            required: true,
            model: models.Survivors,
            as: 'Survivor',
            attributes: ['id', 'firstName', 'lastName'], // Include survivor details
          },
        ],
      },
    ],
  })) as unknown as TribeMemberQueryResult[];
  return tribeMembersAttributes;
}

// async function getTribeMemberIds(
//   tribeId: TribeAttributes['id'],
//   episodeId: EpisodeAttributes['episodeId']
// ): Promise<TribeWithMembers> {
//   // Fetch the episode to get its number
//   const episode = await episodeService.getEpisode('episodeId', episodeId);
//   const episodeNumber = episode.number;
//   const allEpisodes = await episodeService.getAllEpisodesInSeason(
//     episode.seasonId
//   );
//   const doesEpisodeHaveTribeSwitch = episode.isTribeSwitch;

//   // Fetch tribe members for the given episode
//   const tribeMembersAttributes = (await models.TribeMembers.findAll({
//     where: {
//       tribeId, // Filter by the given tribe
//     },
//     include: [
//       {
//         model: models.Tribe,
//         as: 'tribe',
//         attributes: ['id', 'name'], // Include tribe details
//       },
//       {
//         model: models.SurvivorDetailsOnSeason,
//         as: 'survivor',
//         include: [
//           {
//             required: true,
//             model: models.Survivors,
//             as: 'Survivor',
//             attributes: ['id', 'firstName', 'lastName'], // Include survivor details
//           },
//         ],
//       },
//     ],
//   })) as unknown as TribeMemberQueryResult[];

//   // Filter tribe members based on episode numbers
//   const filteredMembers = tribeMembersAttributes.filter((member) => {
//     const startEpisodeNumber = episodeMap.get(member.episodeIdStart);
//     const endEpisodeNumber =
//       member.episodeIdEnd !== null ? episodeMap.get(member.episodeIdEnd) : null;

//     // Include only survivors who joined before the tribe switch
//     return (
//       startEpisodeNumber! < tribeSwitchEpisodeNumber && // Joined before the tribe switch
//       startEpisodeNumber! <= episodeNumber && // Joined on or before the given episode
//       (endEpisodeNumber === null || endEpisodeNumber! > episodeNumber) // Still in the tribe or left after the given episode
//     );
//   });

//   const tribes: Record<string, TribeWithMembers> = {};

//   // Group survivors by tribe
//   filteredMembers.forEach((member) => {
//     const tribeId = member.tribe.id;
//     if (!tribes[tribeId]) {
//       tribes[tribeId] = {
//         tribe: member.tribe,
//         survivors: [],
//       };
//     }
//     tribes[tribeId].survivors.push({
//       id: member.survivor.id,
//       firstName: member.survivor.firstName,
//       lastName: member.survivor.lastName,
//       name: `${member.survivor.firstName} ${member.survivor.lastName}`,
//     });
//   });

//   // Fetch the survivor eliminated in the given episode
//   const eliminatedSurvivor = (await models.SeasonEliminations.findOne({
//     where: {
//       episodeId, // Match the given episode
//     },
//     include: [
//       {
//         model: models.SurvivorDetailsOnSeason,
//         as: 'survivor',
//         include: [
//           {
//             required: true,
//             model: models.Survivors,
//             as: 'Survivor',
//             attributes: ['id', 'firstName', 'lastName'], // Include survivor details
//           },
//         ],
//       },
//     ],
//   })) as unknown as EliminatedSurvivorQueryResult;

//   if (eliminatedSurvivor) {
//     const eliminatedSurvivorTribeMemberStatuses =
//       await models.TribeMembers.findAll({
//         where: {
//           survivorId: eliminatedSurvivor.survivor.id,
//           tribeId,
//         },
//       });
//     if (eliminatedSurvivorTribeMemberStatuses.length > 0) {
//       eliminatedSurvivorTribeMemberStatuses.sort((a, b) => {
//         const startA = episodeMap.get(a.episodeIdStart)!;
//         const startB = episodeMap.get(b.episodeIdStart)!;
//         return startA - startB;
//       });
//       const survivorTribeMemberStatusWhenEliminated =
//         eliminatedSurvivorTribeMemberStatuses[0];
//       const tribeId = survivorTribeMemberStatusWhenEliminated.tribeId;
//       if (tribes[tribeId] && tribes[tribeId].survivors) {
//         tribes[tribeId].survivors.push({
//           id: eliminatedSurvivor.survivor.id,
//           firstName: eliminatedSurvivor.survivor.firstName,
//           lastName: eliminatedSurvivor.survivor.lastName,
//           name: `${eliminatedSurvivor.survivor.firstName} ${eliminatedSurvivor.survivor.lastName}`,
//         });
//       }
//     }
//   }

//   return tribes[tribeId];
// }

export default tribeMemberRepository;
