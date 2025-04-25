import { Op, Transaction } from 'sequelize';
import { TribeMemberAttributes } from '../../../models/season/TribeMembers';
import { inject, injectable } from 'tsyringe';
import { models } from '../../../config/db';
import { TribeAttributes } from '../../../models/season/Tribes';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { SurvivorDetailsOnSeasonAttributes } from '../../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../../models/survivors/Survivors';
import { EpisodeRepository } from '../episode/EpisodeRepository';
import { TribeRepository } from './TribeRepository';
import {
  InternalServerError,
  NotFoundError,
} from '../../../utils/errors/errors';
import { EpisodeType } from '../../../generated-api';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { SeasonService } from '../../../services/season/SeasonService';
import { SeasonStorage } from '../../../domain/season/Season';

type TribeMemberRosterHistoryQuery = (TribeMemberAttributes & {
  tribe: TribeAttributes;
  episodeStarted: EpisodeAttributes;
  episodeEnded: EpisodeAttributes | null;
  survivor: SurvivorDetailsOnSeasonAttributes & {
    Survivor: SurvivorsAttributes;
  };
})[];

@injectable()
export class TribeMemberRepository {
  constructor(
    @inject(EpisodeRepository) private episodeRepository: EpisodeRepository,
    @inject(TribeRepository) private tribeRepository: TribeRepository,
    @inject(SeasonStorage) private seasonStorage: SeasonStorage
  ) {}

  async getSurvivorIdsInTribeAtEpisodeStart(
    tribeId: TribeMemberAttributes['tribeId'],
    episodeId: TribeMemberAttributes['episodeIdStart']
  ): Promise<TribeMemberAttributes['survivorId'][]> {
    const fullTribeMemberHistory = await this.getTribeMembersHistory(tribeId);

    const tribeAttributes = await this.tribeRepository.findTribeById(tribeId);
    if (!tribeAttributes) {
      throw new NotFoundError(`Tribe with ID ${tribeId} not found`);
    }

    const episodeAttributes = await this.episodeRepository.findByPk(episodeId);
    if (!episodeAttributes) {
      throw new NotFoundError(`Episode with ID ${episodeId} not found`);
    }

    const episodeNumber = episodeAttributes.number;
    const isMergeTribe = tribeAttributes.mergeTribe;
    const isTribeSwitch = this.seasonStorage
      .getSeason(episodeAttributes.seasonId)
      .getEpisodeByNumber(episodeNumber)
      .getEpisodeEvents()
      .getTribeSwitch();

    const tribeMembersOnTribeAtEpisodeStart = fullTribeMemberHistory.filter(
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
    return this.getTribeMemberIds(tribeMembersOnTribeAtEpisodeStart);
  }

  async getSurvivorIdsInTribeAtEpisodeEnd(
    tribeId: TribeMemberAttributes['tribeId'],
    episodeId: TribeMemberAttributes['episodeIdStart']
  ): Promise<TribeMemberAttributes['survivorId'][]> {
    const fullTribeMemberHistory = await this.getTribeMembersHistory(tribeId);

    const tribeAttributes = await this.tribeRepository.findTribeById(tribeId);
    if (!tribeAttributes) {
      throw new NotFoundError(`Tribe with ID ${tribeId} not found`);
    }

    const episodeAttributes = await this.episodeRepository.findByPk(episodeId);
    if (!episodeAttributes) {
      throw new NotFoundError(`Episode with ID ${episodeId} not found`);
    }

    const episodeNumber = episodeAttributes.number;
    const isMergeTribe = tribeAttributes.mergeTribe;
    const isTribeSwitch = this.seasonStorage
      .getSeason(episodeAttributes.seasonId)
      .getEpisodeByNumber(episodeNumber)
      .getEpisodeEvents()
      .getTribeSwitch();

    const tribeMembersOnTribeAtEpisodeEnd = fullTribeMemberHistory.filter(
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

    return this.getTribeMemberIds(tribeMembersOnTribeAtEpisodeEnd);
  }

  async getSurvivorIdsInTribeAtEpisodeTribal(
    tribeId: TribeMemberAttributes['tribeId'],
    episodeId: TribeMemberAttributes['episodeIdStart']
  ): Promise<TribeMemberAttributes['survivorId'][]> {
    const fullTribeMemberHistory = await this.getTribeMembersHistory(tribeId);

    const tribeAttributes = await this.tribeRepository.findTribeById(tribeId);
    if (!tribeAttributes) {
      throw new NotFoundError(`Tribe with ID ${tribeId} not found`);
    }

    const episodeAttributes = await this.episodeRepository.findByPk(episodeId);
    if (!episodeAttributes) {
      throw new NotFoundError(`Episode with ID ${episodeId} not found`);
    }

    const episodeNumber = episodeAttributes.number;
    const isMergeTribe = tribeAttributes.mergeTribe;
    const isTribeSwitch = this.seasonStorage
      .getSeason(episodeAttributes.seasonId)
      .getEpisodeByNumber(episodeNumber)
      .getEpisodeEvents()
      .getTribeSwitch();
    const episodeType = episodeAttributes.type;

    const tribeMembersOnTribeRightBeforeElimination =
      fullTribeMemberHistory.filter((member) => {
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

    return this.getTribeMemberIds(tribeMembersOnTribeRightBeforeElimination);
  }

  private async getTribeMemberIds(
    filteredTribeHistory: TribeMemberRosterHistoryQuery
  ) {
    const tribeMemberIds = filteredTribeHistory.map((member) => {
      return member.survivor.id;
    });
    return tribeMemberIds;
  }

  private async getTribeMembersHistory(
    tribeId: TribeMemberAttributes['tribeId']
  ): Promise<TribeMemberRosterHistoryQuery> {
    const tribeMemberHistoryOnTribe = (await models.TribeMembers.findAll({
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
    })) as unknown as TribeMemberRosterHistoryQuery;
    return tribeMemberHistoryOnTribe;
  }

  async saveTribeStartMembers(
    tribeMembersAttributes: TribeMemberAttributes[],
    transaction: Transaction
  ) {
    for (const tribeMemberAttributes of tribeMembersAttributes) {
      await models.TribeMembers.create(tribeMemberAttributes, { transaction });
    }
  }

  async saveEliminatedTribeMembersAttributes(
    survivorId: TribeMemberAttributes['survivorId'][],
    seasonId: SeasonsAttributes['seasonId'],
    episodeIdEnded: EpisodeAttributes['id'],
    transaction: Transaction
  ) {
    const tribeIds = await models.Tribe.findAll({
      where: {
        seasonId,
      },
      transaction,
    }).then((tribes) => tribes.map((tribe) => tribe.id));

    await models.TribeMembers.update(
      {
        episodeIdEnd: episodeIdEnded,
      },
      {
        where: {
          tribeId: { [Op.in]: tribeIds },
          survivorId: { [Op.in]: survivorId },
          episodeIdEnd: null,
        },
        transaction,
      }
    );
  }

  async saveTribeSwitch(
    tribeMembersAttributes: TribeMemberAttributes[],
    episodeId: TribeMemberAttributes['episodeIdStart'],
    transaction: Transaction
  ) {
    for (const tribeMemberAttributes of tribeMembersAttributes) {
      const survivorCurrentTribeStatusAttributes =
        await models.TribeMembers.findOne({
          where: {
            survivorId: tribeMemberAttributes.survivorId,
            episodeIdEnd: null,
          },
          transaction,
        });
      if (!survivorCurrentTribeStatusAttributes) {
        throw new InternalServerError(
          `Survivor with ID ${tribeMemberAttributes.survivorId} not found in tribe members with episodeIdEnd === null`
        );
      }

      if (
        survivorCurrentTribeStatusAttributes.tribeId ===
        tribeMemberAttributes.tribeId
      ) {
        await survivorCurrentTribeStatusAttributes.update(
          {
            notes: 'Stayed in the same tribe after tribe switch',
          },
          {
            transaction,
          }
        );
      } else {
        await survivorCurrentTribeStatusAttributes.update(
          {
            episodeIdEnd: episodeId,
            notes: 'Moved to a new tribe for tribe switch',
            isTribeSwitch: true,
          },
          {
            transaction,
          }
        );
        await models.TribeMembers.create(
          {
            tribeId: tribeMemberAttributes.tribeId,
            survivorId: tribeMemberAttributes.survivorId,
            episodeIdStart: episodeId,
            episodeIdEnd: null,
            notes: 'Moved to a new tribe for tribe switch',
          },
          { transaction }
        );
      }
    }
  }
}
