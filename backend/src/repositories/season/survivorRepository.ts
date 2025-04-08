import { Op } from 'sequelize';
import { models } from '../../config/db';
import {
  EliminationStatus,
  EpisodeType,
  Survivor,
  SurvivorStatus,
} from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import { InternalServerError } from '../../utils/errors/errors';
import episodeService from '../../services/season/episodeService';
import survivorService from '../../services/season/survivorService';
import { TribeAttributes } from '../../models/season/Tribes';
import seasonEliminationService from '../../services/season/seasonEliminationService';
import tribeMemberRepository from './tribeMemberRepository';

const survivorRepository = {
  getSurvivor,
  getSurvivorsBySeasonId,
  getSurvivorWithStatusAtStartOfEpisode,
  getSurvivorStatusAtEpisode,
};

async function getSurvivorStatusAtEpisode(
  survivorId: SurvivorsAttributes['id'],
  episodeId: EpisodeAttributes['id']
): Promise<SurvivorStatus> {
  const survivorEliminationStatus =
    await seasonEliminationService.getSurvivorEliminationStatusAtStartOfEpisode(
      survivorId,
      episodeId
    );

  const currentTribeId =
    await tribeMemberRepository.getTribeIdSurvivorBelongsToAtStartOfEpisode(
      survivorId,
      episodeId
    );

  return {
    episodeId: episodeId,
    eliminationStatus: survivorEliminationStatus,
    currentTribeId: currentTribeId,
  };
}

async function getSurvivorWithStatusAtStartOfEpisode(
  episodeId: EpisodeAttributes['id'],
  seasonId: SeasonsAttributes['seasonId']
): Promise<Survivor[]> {
  const survivorsOnSeason = (await models.SurvivorDetailsOnSeason.findAll({
    where: {
      seasonId: seasonId,
    },
    include: [
      {
        model: models.Survivors,
        as: 'Survivor',
        required: true,
      },
    ],
  })) as unknown as (SurvivorDetailsOnSeasonAttributes & {
    Survivor: SurvivorsAttributes;
  })[];

  const survivors: Survivor[] = [];

  if (!survivorsOnSeason) {
    throw new InternalServerError(`No survivors found for season ${seasonId}`);
  }

  for (const survivor of survivorsOnSeason) {
    const survivorEliminationInfo = await models.SeasonEliminations.findOne({
      where: {
        survivorId: survivor.id,
        seasonId: seasonId,
      },
    });

    const eliminationStatus: EliminationStatus = {
      isEliminated: !!survivorEliminationInfo,
      dayEliminated: survivorEliminationInfo?.day || null,
      episodeEliminated: survivorEliminationInfo?.episodeId || null,
      placement: survivorEliminationInfo?.placement || null,
    };

    let currentTribeId: TribeAttributes['id'] | undefined;

    if (eliminationStatus.isEliminated) {
    } else {
      const tribesInSeason = await models.Tribe.findAll({
        where: {
          seasonId: seasonId,
        },
      });
      const episode = await models.Episode.findOne({
        where: {
          id: episodeId,
          seasonId: seasonId,
        },
      });
      if (!episode) {
        throw new InternalServerError(`Episode ${episodeId} not found`);
      }
      const episodeType = episode.type;

      let getMergeTribes: boolean;
      if (
        [
          EpisodeType.POSTMERGE,
          EpisodeType.FINALE,
          EpisodeType.FINALE1,
          EpisodeType.FINALE2,
        ].includes(episodeType)
      ) {
        getMergeTribes = true;
      } else if (
        [
          EpisodeType.PREMERGE,
          EpisodeType.PREMIERE,
          EpisodeType.TRIBELESS,
        ].includes(episodeType)
      ) {
        getMergeTribes = false;
      } else {
        throw new InternalServerError(`Invalid episode type ${episodeType}`);
      }

      const tribes = await models.Tribe.findAll({
        where: {
          seasonId: seasonId,
          mergeTribe: getMergeTribes,
        },
      });

      const tribesToQueryAgainst = tribes.map((tribe) => tribe.id);
      const episodeNumber = episode.number;

      const allTribeHistory = await models.TribeMembers.findAll({
        where: {
          tribeId: {
            [Op.in]: tribesToQueryAgainst,
          },
          survivorId: survivor.id,
        },
      });

      const tribeHistory = await Promise.all(
        allTribeHistory.map(async (tribeMemberHistory) => {
          const startingEpisode = await episodeService.getEpisode(
            'episodeId',
            tribeMemberHistory.episodeIdStart
          );
          const endingEpisode = tribeMemberHistory.episodeIdEnd
            ? await episodeService.getEpisode(
                'episodeId',
                tribeMemberHistory.episodeIdEnd
              )
            : null;

          if (endingEpisode === null) {
            return episodeNumber > startingEpisode.number
              ? tribeMemberHistory
              : null;
          } else {
            if (
              //3 >  1 && 3 <= 2
              episodeNumber > startingEpisode.number &&
              episodeNumber <= endingEpisode.number
            ) {
              return tribeMemberHistory;
            }

            return null;
          }
        })
      );
      const filteredTribeHistory = tribeHistory.filter((tribeHistory) => {
        return tribeHistory !== null;
      });

      if (filteredTribeHistory.length !== 1) {
        throw new InternalServerError(
          `Survivor ${survivor.id} has multiple tribes at start of episode ${episodeId}`
        );
      }

      currentTribeId = filteredTribeHistory[0].tribeId;
    }

    const survivorStatus: SurvivorStatus = {
      episodeId: episodeId,
      eliminationStatus: eliminationStatus,
      currentTribeId: currentTribeId || null,
    };

    const survivorObject = await survivorService.getSurvivorById(
      survivor.id,
      seasonId
    );
    survivorObject.survivorStatus = survivorStatus;

    survivors.push(survivorObject);
  }
  return survivors;
}

async function getSurvivor(
  survivorId: SurvivorsAttributes['id'],
  seasonId: SurvivorDetailsOnSeasonAttributes['seasonId']
): Promise<
  SurvivorDetailsOnSeasonAttributes & { survivor: SurvivorsAttributes }
> {
  const survivorDetailsOnSeasonAttributes =
    await models.SurvivorDetailsOnSeason.findOne({
      where: {
        id: survivorId,
        seasonId: seasonId,
      },
    });

  if (!survivorDetailsOnSeasonAttributes) {
    throw new Error(
      `Survivor with id ${survivorId} not found on season${seasonId}`
    );
  }

  const survivorAttributes = await models.Survivors.findOne({
    where: {
      id: survivorId,
    },
  });

  if (!survivorAttributes) {
    throw new Error(`Survivor with id ${survivorId} not found`);
  }

  return {
    ...survivorDetailsOnSeasonAttributes,
    survivor: survivorAttributes,
  };
}

async function getSurvivorsBySeasonId(
  seasonId: SurvivorDetailsOnSeasonAttributes['seasonId']
): Promise<
  (SurvivorDetailsOnSeasonAttributes & { survivor: SurvivorsAttributes })[]
> {
  const survivorsAttributesOnSeason: SurvivorDetailsOnSeasonAttributes[] =
    await models.SurvivorDetailsOnSeason.findAll({
      where: {
        seasonId: seasonId,
      },
    });

  const survivorIdsOnSeason = survivorsAttributesOnSeason.map((survivor) => {
    return survivor.id;
  });

  return await Promise.all(
    survivorIdsOnSeason.map(
      async (survivorId) => await getSurvivor(survivorId, seasonId)
    )
  );
}

export default survivorRepository;
