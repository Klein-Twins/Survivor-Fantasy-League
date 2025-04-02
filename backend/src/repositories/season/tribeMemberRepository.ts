import { models } from '../../config/db';
import logger from '../../config/logger';
import { SurvivorBasic } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { TribeMemberAttributes } from '../../models/season/TribeMembers';
import { TribeAttributes } from '../../models/season/Tribes';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import episodeService from '../../services/season/episodeService';
import tribeService from '../../services/season/tribeService';
import tribeRepository from './tribeRepository';

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
};

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
