import { injectable } from 'tsyringe';
import { SurvivorsAttributes } from '../../../models/survivors/Survivors';
import { models } from '../../../config/db';
import { SurvivorDetailsOnSeasonAttributes } from '../../../models/survivors/SurvivorDetailsOnSeason';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { Transaction } from 'sequelize';
import logger from '../../../config/logger';

type SeasonSurvivorQueryResult =
  | (SurvivorDetailsOnSeasonAttributes & {
      Survivor: SurvivorsAttributes;
    })
  | null;

@injectable()
export class SeasonSurvivorRepository {
  async findBySurvivorIdAndSeasonId(
    survivorId: SurvivorsAttributes['id'],
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<(SurvivorDetailsOnSeasonAttributes & SurvivorsAttributes) | null> {
    const queryResult = (
      await models.SurvivorDetailsOnSeason.findOne({
        where: {
          id: survivorId,
          seasonId,
        },
        include: [
          {
            model: models.Survivors,
            as: 'Survivor',
            required: true,
          },
        ],
      })
    )?.get({ plain: true }) as unknown as SeasonSurvivorQueryResult;

    if (!queryResult) {
      return null;
    }

    return {
      ...queryResult,
      ...queryResult.Survivor,
    };
  }

  async findSurvivorsIdsInSeason(
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<SurvivorsAttributes['id'][]> {
    const survivorIds = await models.SurvivorDetailsOnSeason.findAll({
      where: {
        seasonId,
      },
    }).then((survivors) => survivors.map((survivor) => survivor.id));
    return survivorIds;
  }

  async saveSeasonSurvivorAttirbutes(
    survivorAttributes: SurvivorDetailsOnSeasonAttributes & SurvivorsAttributes,
    transaction: Transaction
  ): Promise<void> {
    logger.debug(
      `${models.Survivors.tableName}: Saving attributes: ${JSON.stringify(
        survivorAttributes
      )}`
    );
    await models.Survivors.upsert(
      {
        id: survivorAttributes.id,
        firstName: survivorAttributes.firstName,
        lastName: survivorAttributes.lastName,
        fromState: survivorAttributes.fromState,
        fromCity: survivorAttributes.fromCity,
        fromCountry: survivorAttributes.fromCountry,
        nickName: survivorAttributes.nickName,
      },
      {
        transaction,
      }
    );
    logger.debug(
      `${
        models.SurvivorDetailsOnSeason.tableName
      }: Saving attributes: ${JSON.stringify(survivorAttributes)}`
    );
    await models.SurvivorDetailsOnSeason.upsert(
      {
        id: survivorAttributes.id,
        seasonId: survivorAttributes.seasonId,
        age: survivorAttributes.age,
        description: survivorAttributes.description,
        job: survivorAttributes.job,
      },
      {
        transaction,
      }
    );
  }
}
