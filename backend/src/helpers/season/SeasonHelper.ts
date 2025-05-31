import { injectable } from 'tsyringe';
import { models } from '../../config/db';

@injectable()
export class SeasonHelper {
  async doesSeasonExist(seasonId: number): Promise<boolean> {
    const season = await models.Seasons.findOne({
      where: {
        seasonId,
      },
    });

    return season !== null;
  }
}
