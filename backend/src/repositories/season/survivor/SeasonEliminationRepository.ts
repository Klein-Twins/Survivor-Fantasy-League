import { injectable } from 'tsyringe';
import { SeasonEliminationAttributes } from '../../../models/season/SeasonEliminations';
import { Transaction } from 'sequelize';
import { models } from '../../../config/db';

@injectable()
export class SeasonEliminationRepository {
  async saveEliminationAttributes(
    attributes: SeasonEliminationAttributes,
    transaction: Transaction
  ) {
    await models.SeasonEliminations.upsert(attributes, {
      transaction,
    });
  }
}
