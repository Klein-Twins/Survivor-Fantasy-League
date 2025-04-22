import { injectable } from 'tsyringe';
import { models } from '../../config/db';
import { Season } from '../../domain/season/season';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { Transaction } from 'sequelize';
import { Transactional } from '../../repositoriesBackup/utils/Transactional';

@injectable()
export class SeasonRepository {
  async findById(seasonId: number): Promise<SeasonsAttributes | null> {
    return await models.Seasons.findByPk(seasonId).then((season) => {
      if (!season) {
        return null;
      }
      return season.get({ plain: true }) as SeasonsAttributes;
    });
  }

  @Transactional()
  async saveSeason(
    seasonAttributes: SeasonsAttributes,
    transaction?: Transaction
  ): Promise<void> {
    await models.Seasons.upsert(seasonAttributes, { transaction });
  }
}
