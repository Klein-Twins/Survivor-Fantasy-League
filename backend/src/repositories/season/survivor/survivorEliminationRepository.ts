import { injectable } from 'tsyringe';
import { SeasonEliminationAttributes } from '../../../models/season/SeasonEliminations';
import { Transaction } from 'sequelize';
import { Transactional } from '../../../repositoriesBackup/utils/Transactional';
import { models } from '../../../config/db';
import logger from '../../../config/logger';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { SurvivorsAttributes } from '../../../models/survivors/Survivors';

@injectable()
export class SurvivorEliminationRepository {
  async findSurvivorElimination(
    survivorId: SurvivorsAttributes['id'],
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<SeasonEliminationAttributes | null> {
    const survivorElimination = await models.SeasonEliminations.findOne({
      where: {
        survivorId,
        seasonId,
      },
    });

    if (!survivorElimination) {
      return null;
    }

    return survivorElimination.get({ plain: true });
  }

  @Transactional()
  async saveSurvivorElimination(
    seasonEliminationAttributes: SeasonEliminationAttributes,
    transaction?: Transaction
  ) {
    const data = await models.SeasonEliminations.upsert(
      seasonEliminationAttributes,
      {
        transaction,
      }
    );

    logger.debug(
      `Survivor elimination saved: ${JSON.stringify(data[0].dataValues)}`
    );
  }
}
