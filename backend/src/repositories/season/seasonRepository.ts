import { injectable } from 'tsyringe';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { models } from '../../config/db';
import { Transaction } from 'sequelize';
import logger from '../../config/logger';

@injectable()
export class SeasonRepository {
  async findByPk(
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<SeasonsAttributes | null> {
    return await models.Seasons.findByPk(seasonId);
  }

  async findAllSeasons(): Promise<SeasonsAttributes[]> {
    return await models.Seasons.findAll();
  }

  async saveSeasonAttributes(
    seasonAttributes: SeasonsAttributes,
    transaction: Transaction
  ): Promise<void> {
    logger.debug(
      `${models.Seasons.tableName}: Saving attributes: ${JSON.stringify(
        seasonAttributes
      )}`
    );
    await models.Seasons.upsert(seasonAttributes, {
      transaction,
    });
  }
}
