import { injectable } from 'tsyringe';
import { models } from '../../../config/db';
import { TribeAttributes } from '../../../models/season/Tribes';
import { Transactional } from '../../../repositoriesBackup/utils/Transactional';
import { Transaction } from 'sequelize';

@injectable()
export class TribeRepository {
  async findById(
    tribeId: TribeAttributes['id']
  ): Promise<TribeAttributes | null> {
    return await models.Tribe.findByPk(tribeId);
  }

  async findAllBySeasonId(
    seasonId: TribeAttributes['seasonId']
  ): Promise<TribeAttributes[]> {
    return await models.Tribe.findAll({
      where: { seasonId },
    });
  }

  @Transactional()
  async save(tribe: TribeAttributes, transaction?: Transaction): Promise<void> {
    await models.Tribe.upsert(tribe);
  }
}
