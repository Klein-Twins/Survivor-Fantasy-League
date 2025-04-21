import { UUID } from 'crypto';
import { models } from '../../config/db';
import {
  EpisodeType,
  Survivor,
  SurvivorBasic,
  TribeMembersState,
} from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { TribeMemberAttributes } from '../../models/season/TribeMembers';
import { TribeAttributes } from '../../models/season/Tribes';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import tribeMemberRepository, {
  TribeMemberQueryResult,
} from '../../repositoriesBackup/season/tribeMemberRepository';
import tribeService from './tribeService';
import episodeRepository from '../../repositoriesBackup/season/episode/episodeRepository';
import survivorService from './survivorService';
import tribeRepository from '../../repositoriesBackup/season/tribeRepository';
import { NotFoundError } from '../../utils/errors/errors';
import episodeService from './episodeService';

const tribeMemberService = {
  getTribeMembers,
  getTribeMembersOnEpisode,
  getTribesState,
  getTribeState,
};

// async function getTribeMemberStatusesOnEpisode(
//   episodeId: EpisodeAttributes['id'],
//   seasonId: SeasonsAttributes['seasonId']
// ): Promise<void> {
//   const tribes = await tribeService.getTribesBySeasonId(seasonId);

//   const tribeStatuses: TribeStatuses = [];
//   for (const tribe of tribes) {
//     const tribeMembersAtTheBeginningOfEpisode =
//       await getTribeMembersOnTribeAtEpisodeStart(tribe.id as UUID, episodeId);
//   }
// }

async function getOriginalTribeMembers(tribeId: TribeAttributes['id']) {
  const tribeAttributes = await models.Tribe.findByPk(tribeId);
  if (!tribeAttributes) {
    throw new NotFoundError(`Tribe with ${tribeId} not found`);
  }

  if (!tribeAttributes.mergeTribe) {
    const premierEpisodeAttributes = await models.Episode.findOne({
      where: { seasonId: tribeAttributes.seasonId, number: 1 },
    });
    if (!premierEpisodeAttributes) {
      throw new NotFoundError(
        `Episode with seasonId ${tribeAttributes.seasonId} and number 1 not found`
      );
    }

    const tribeMembers = (await models.TribeMembers.findAll({
      where: { tribeId },
      include: [
        {
          model: models.SurvivorDetailsOnSeason,
          as: 'survivor',
          required: true,
          include: [
            {
              model: models.Survivors,
              as: 'Survivor',
              required: true,
            },
          ],
        },
      ],
    })) as unknown as Survivor;
  }
}

async function getTribeMembers(
  tribeId: TribeAttributes['id'],
  episodeId: EpisodeAttributes['id']
): Promise<SurvivorBasic[]> {
  const tribeMemberHistory = await tribeMemberRepository.fetchTribeHistory(
    tribeId
  );
  const tribeMembersOnEpisode = await getTribeMembersOnEpisode(
    tribeMemberHistory,
    episodeId
  );
  return tribeMembersOnEpisode;
}

async function getTribesState(
  episodeId: EpisodeAttributes['id'],
  seasonId: SeasonsAttributes['seasonId']
): Promise<Map<TribeAttributes['id'], TribeMembersState>> {
  const tribes = await models.Tribe.findAll({
    where: { seasonId },
  });
  const tribeStatuses: Map<TribeAttributes['id'], TribeMembersState> =
    new Map();
  for (const tribe of tribes) {
    const tribeMembership = await getTribeState(tribe.id as UUID, episodeId);
    tribeStatuses.set(tribe.id, tribeMembership);
  }

  return tribeStatuses;
}

async function getTribeState(
  tribeId: TribeAttributes['id'],
  episodeId: EpisodeAttributes['id']
): Promise<TribeMembersState> {
  // const { seasonId, number } = await episodeService.getEpisode(
  //   'episodeId',
  //   episodeId
  // );

  const episodeAttributes = await episodeRepository.getEpisode(
    'episodeId',
    episodeId
  );
  const {
    number: episodeNumber,
    isTribeSwitch,
    type: episodeType,
  } = episodeAttributes!;

  type TribeMembersQueryResult = TribeMemberAttributes & {
    tribe: TribeAttributes;
    episodeStarted: EpisodeAttributes;
    episodeEnded: EpisodeAttributes | null;
    survivor: SurvivorDetailsOnSeasonAttributes & {
      Survivor: SurvivorsAttributes;
    };
  };

  const tribeMembersAttributes = (await models.TribeMembers.findAll({
    where: { tribeId },
    include: [
      {
        model: models.Tribe,
        as: 'tribe',
        required: true,
      },
      {
        model: models.Episode,
        as: 'episodeStarted',
        required: true,
      },
      {
        model: models.Episode,
        as: 'episodeEnded',
        required: false,
      },
      {
        model: models.SurvivorDetailsOnSeason,
        as: 'survivor',
        required: true,
        include: [
          {
            model: models.Survivors,
            as: 'Survivor',
            required: true,
          },
        ],
      },
    ],
  })) as unknown as TribeMembersQueryResult[];

  const tribeMembersOnTribeAtEpisodeStart = tribeMembersAttributes.filter(
    (member) => {
      const startEpisodeNumber = member.episodeStarted.number;
      const endEpisodeNumber = member.episodeEnded
        ? member.episodeEnded.number
        : null;

      if (episodeNumber < startEpisodeNumber) {
        return false;
      } else if (episodeNumber === startEpisodeNumber) {
        if (episodeNumber === 1) {
          return true;
        }
        return false;
      } else {
        if (endEpisodeNumber === null) {
          return true;
        } else if (episodeNumber <= endEpisodeNumber) {
          return true;
        } else {
          return false;
        }
      }
    }
  );

  const tribeMembersOnTribeAtEpisodeEnd = tribeMembersAttributes.filter(
    (member) => {
      const startEpisodeNumber = member.episodeStarted.number;
      const endEpisodeNumber = member.episodeEnded
        ? member.episodeEnded.number
        : null;

      if (isTribeSwitch) {
        if (episodeNumber < startEpisodeNumber) {
          return false;
        } else if (episodeNumber === startEpisodeNumber) {
          if (endEpisodeNumber === null) {
            return true;
          }
          if (episodeNumber < endEpisodeNumber) {
            return true;
          }
          if (episodeNumber === endEpisodeNumber) {
            return false;
          }
          if (episodeNumber > endEpisodeNumber) {
            return false;
          }
        } else {
          if (endEpisodeNumber === null) {
            return true;
          } else if (episodeNumber < endEpisodeNumber) {
            return true;
          } else if (episodeNumber === endEpisodeNumber) {
            return false;
          } else {
            return false;
          }
        }
      }

      if (episodeNumber < startEpisodeNumber) {
        return false;
      } else if (episodeNumber === startEpisodeNumber) {
        if (endEpisodeNumber === null) {
          return true;
        } else {
          if (episodeNumber >= endEpisodeNumber) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        if (endEpisodeNumber === null) {
          return true;
        } else if (episodeNumber < endEpisodeNumber) {
          return true;
        } else {
          return false;
        }
      }
    }
  );

  const tribeMembersOnTribeRightBeforeElimination =
    tribeMembersAttributes.filter((member) => {
      const startEpisodeNumber = member.episodeStarted.number;
      const endEpisodeNumber = member.episodeEnded
        ? member.episodeEnded.number
        : null;

      if (episodeType === EpisodeType.TRIBELESS) {
        return false;
      }

      if (isTribeSwitch) {
        if (episodeNumber < startEpisodeNumber) {
          return false;
        } else if (episodeNumber === startEpisodeNumber) {
          if (endEpisodeNumber === null) {
            return true;
          }
          if (episodeNumber < endEpisodeNumber) {
            return true;
          }
          if (episodeNumber === endEpisodeNumber) {
            return true;
          }
          if (episodeNumber > endEpisodeNumber) {
            return false;
          }
        } else {
          if (endEpisodeNumber === null) {
            return true;
          } else if (episodeNumber < endEpisodeNumber) {
            return true;
          } else if (episodeNumber === endEpisodeNumber) {
            return false;
          } else {
            return false;
          }
        }
      }

      if (episodeNumber < startEpisodeNumber) {
        return false;
      } else if (episodeNumber === startEpisodeNumber) {
        if (endEpisodeNumber === null) {
          return true;
        } else {
          if (episodeNumber <= endEpisodeNumber) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        if (endEpisodeNumber === null) {
          return true;
        } else if (episodeNumber <= endEpisodeNumber) {
          return true;
        } else {
          return false;
        }
      }
    });

  const tribeStatuses: TribeMembersState = {
    tribeMembersEpisodeStart: tribeMembersOnTribeAtEpisodeStart.map((member) =>
      survivorService.buildBasicSurvivor(member.survivor.Survivor)
    ),
    tribeMembersBeforeElimination:
      tribeMembersOnTribeRightBeforeElimination.map((member) =>
        survivorService.buildBasicSurvivor(member.survivor.Survivor)
      ),
    tribeMembersAtEndOfEpisode: tribeMembersOnTribeAtEpisodeEnd.map((member) =>
      survivorService.buildBasicSurvivor(member.survivor.Survivor)
    ),
  };

  return tribeStatuses;
}

async function getTribeMembersOnTribeAtEpisodeEnd() {}

async function getTribeMembersOnTribeBeforeElimination() {}

async function getTribeMembersOnEpisode(
  tribeMemberHistory: TribeMemberQueryResult[],
  episodeId: EpisodeAttributes['id']
): Promise<SurvivorBasic[]> {
  const episode = await episodeService.getEpisode('episodeId', episodeId);
  const episodeNumber = episode.number;
  const allEpisodes = await episodeService.getAllEpisodesInSeason(
    episode.seasonId
  );

  // Dynamically determine if a tribe switch exists
  const tribeSwitchEpisode = Array.from(allEpisodes.values()).find(
    (ep) => ep.isTribeSwitch
  );
  const tribeSwitchEpisodeNumber = tribeSwitchEpisode
    ? tribeSwitchEpisode.number
    : null; // If no tribe switch, set to null

  const tribeMembersOnEpisode = tribeMemberHistory.filter((member) => {
    const startEpisodeNumber = allEpisodes.get(member.episodeIdStart)!.number;
    const endEpisodeNumber =
      member.episodeIdEnd !== null
        ? allEpisodes.get(member.episodeIdEnd)!.number
        : null;

    if (episodeNumber === 1 && startEpisodeNumber === 1) {
      return true;
    }

    //Case Tribe Switch has not happened.
    if (
      tribeSwitchEpisodeNumber === null ||
      tribeSwitchEpisodeNumber > episodeNumber
    ) {
      return (
        startEpisodeNumber < episodeNumber && // Joined before the given episode
        (endEpisodeNumber === null || endEpisodeNumber >= episodeNumber) && // Still in the tribe or left after the given episode
        (tribeSwitchEpisodeNumber === null ||
          episodeNumber <= tribeSwitchEpisodeNumber) // If tribe switch exists, ensure it's before or at the switch
      );
    } else {
      //Case Tribe Switch has happened.
      return (
        startEpisodeNumber < episodeNumber && // Joined before the given episode
        (endEpisodeNumber === null || endEpisodeNumber >= episodeNumber) && // Still in the tribe or left after the given episode
        (tribeSwitchEpisodeNumber === null ||
          episodeNumber >= tribeSwitchEpisodeNumber) // If tribe switch exists, ensure it's before or at the switch
      );
    }
  });

  return tribeMembersOnEpisode.map((member) => ({
    id: member.survivor.id,
    firstName: member.survivor.firstName,
    lastName: member.survivor.lastName,
    name: `${member.survivor.firstName} ${member.survivor.lastName}`,
  }));
}

export default tribeMemberService;
