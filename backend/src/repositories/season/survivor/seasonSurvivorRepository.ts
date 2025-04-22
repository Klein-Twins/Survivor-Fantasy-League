import { injectable } from 'tsyringe';
import { SurvivorsAttributes } from '../../../models/survivors/Survivors';
import { SurvivorDetailsOnSeasonAttributes } from '../../../models/survivors/SurvivorDetailsOnSeason';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { models } from '../../../config/db';
import { Transaction } from 'sequelize';
import { Transactional } from '../../../repositoriesBackup/utils/Transactional';

@injectable()
export class SeasonSurvivorRepository {
  async findSurvivorsIdsInSeason(
    seasonId: SurvivorDetailsOnSeasonAttributes['seasonId']
  ): Promise<SurvivorsAttributes['id'][]> {
    const survivorsAttributesOnSeason: SurvivorDetailsOnSeasonAttributes[] =
      await models.SurvivorDetailsOnSeason.findAll({
        where: {
          seasonId: seasonId,
        },
      });
    const survivorIdsOnSeason = survivorsAttributesOnSeason.map((survivor) => {
      return survivor.id;
    });
    return survivorIdsOnSeason;
  }

  async findBySurvivorIdAndSeasonId(
    survivorId: SurvivorsAttributes['id'],
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<(SurvivorsAttributes & SurvivorDetailsOnSeasonAttributes) | null> {
    const survivorData = (
      await models.SurvivorDetailsOnSeason.findOne({
        where: {
          id: survivorId,
          seasonId: seasonId,
        },
        include: [
          {
            model: models.Survivors,
            as: 'Survivor',
            required: true,
          },
        ],
      })
    )?.get({ plain: true }) as unknown as SurvivorDetailsOnSeasonAttributes & {
      Survivor: SurvivorsAttributes;
    };

    return survivorData
      ? {
          ...survivorData,
          ...survivorData.Survivor,
        }
      : null;
  }

  @Transactional()
  async saveSurvivor(
    survivor: SurvivorsAttributes & SurvivorDetailsOnSeasonAttributes,
    transaction?: Transaction
  ) {
    await models.Survivors.upsert(
      {
        id: survivor.id,
        firstName: survivor.firstName,
        lastName: survivor.lastName,
        fromCity: survivor.fromCity,
        fromState: survivor.fromState,
        fromCountry: survivor.fromCountry,
        nickName: survivor.nickName,
      },
      {
        transaction,
      }
    );
    await models.SurvivorDetailsOnSeason.upsert(
      {
        id: survivor.id,
        seasonId: survivor.seasonId,
        age: survivor.age,
        description: survivor.description,
        job: survivor.job,
      },
      {
        transaction,
      }
    );
  }
}
