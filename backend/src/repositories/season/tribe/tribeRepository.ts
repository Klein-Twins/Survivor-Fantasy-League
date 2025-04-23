import { injectable } from 'tsyringe';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { TribeAttributes } from '../../../models/season/Tribes';
import { models } from '../../../config/db';
import { Transaction } from 'sequelize';
import logger from '../../../config/logger';

@injectable()
export class TribeRepository {
  async findTribeById(
    tribeId: TribeAttributes['id']
  ): Promise<TribeAttributes | null> {
    return await models.Tribe.findOne({
      where: {
        id: tribeId,
      },
    }).then((tribe) => (tribe ? tribe.get({ plain: true }) : null));
  }

  async findTribeIdsInSeason(
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<TribeAttributes['id'][]> {
    return await models.Tribe.findAll({
      where: {
        seasonId,
      },
      attributes: ['id'],
    }).then((tribes) => tribes.map((tribe) => tribe.id));
  }

  async saveTribeAttributes(
    tribeAttributes: TribeAttributes,
    transaction: Transaction
  ): Promise<void> {
    logger.debug(
      `${models.Tribe.tableName}: Saving attributes: ${JSON.stringify(
        tribeAttributes
      )}`
    );
    await models.Tribe.upsert(tribeAttributes, {
      transaction,
    });
  }
}
