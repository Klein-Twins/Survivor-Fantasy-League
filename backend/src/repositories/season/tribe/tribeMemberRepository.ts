import { Op, Transaction } from 'sequelize';
import { models } from '../../../config/db';
import { TribeAttributes } from '../../../models/season/Tribes';
import { TribeMemberAttributes } from '../../../models/season/TribeMembers';
import { Transactional } from '../../../repositoriesBackup/utils/Transactional';
import logger from '../../../config/logger';
import { SeasonsAttributes } from '../../../models/season/Seasons';

export class TribeMemberRepository {
  async findStartingTribeMemberIdsForTribe(tribeId: TribeAttributes['id']) {
    const startingTribeMembers = (await models.Tribe.findAll({
      where: {
        id: tribeId,
      },
      include: [
        {
          model: models.TribeMembers,
          as: 'tribeMembers',
          required: true,
          where: {
            '$Tribe.episodeIdStart$': {
              [Op.eq]: models.sequelize.col('tribeMembers.episodeIdStart'),
            },
          },
        },
      ],
    })) as unknown as (TribeAttributes & {
      tribeMembers: TribeMemberAttributes;
    })[];

    return startingTribeMembers.map((member) => member.tribeMembers.survivorId);
  }

  @Transactional()
  async saveTribeMemberElimination(
    {
      episodeIdEnd,
      survivorId,
      seasonId,
    }: Pick<TribeMemberAttributes, 'episodeIdEnd' | 'survivorId'> & {
      seasonId: SeasonsAttributes['seasonId'];
    },
    transaction?: Transaction
  ) {
    const tribeIds = await models.Tribe.findAll({
      where: { seasonId },
    }).then((tribes) => tribes.map((tribe) => tribe.id));

    const tribeMemberOnTribe = await models.TribeMembers.findOne({
      where: {
        survivorId,
        episodeIdEnd: null,
        tribeId: {
          [Op.in]: tribeIds,
        },
      },
      transaction,
    });

    if (!tribeMemberOnTribe) {
      logger.debug(
        `Tribe member with survivorId ${survivorId} not found on an active tribe`
      );
      return;
    } else {
      await models.TribeMembers.update(
        {
          episodeIdEnd,
        },
        {
          where: {
            survivorId,
            episodeIdEnd: null,
            tribeId: {
              [Op.in]: tribeIds,
            },
          },
          transaction,
        }
      );
    }
  }
}
