import { UUID } from 'crypto';
import { models, sequelize } from '../../config/db';
import { CreateSurvivorRequestBody, Survivor } from '../../generated-api';
import survivorHelper from '../../helpers/survivor/survivorHelper';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import {
  InternalServerError,
  NotImplementedError,
} from '../../utils/errors/errors';
import { Transaction } from 'sequelize';

const survivorRepository = {
  getSurvivorsBySeasonId,
  createSurvivor,
};

async function createSurvivor(
  survivorId: SurvivorsAttributes['survivorId'],
  survivorData: CreateSurvivorRequestBody,
  transaction?: Transaction
): Promise<Survivor> {
  let t = transaction;
  if (!transaction) {
    t = await sequelize.transaction();
  }
  try {
    if (
      await survivorHelper.doesSurvivorExist(
        survivorData.firstName,
        survivorData.lastName
      )
    ) {
      return await addExistingSurvivorToSeason(survivorData);
    } else {
      const survivorAttributes: SurvivorsAttributes =
        await models.Survivors.create({
          survivorId: survivorId,
          firstName: survivorData.firstName,
          lastName: survivorData.lastName,
          fromCity: survivorData.fromCity,
          fromState: survivorData.fromState,
          fromCountry: survivorData.fromCountry,
          nickName: survivorData.nickname,
        });
      const survivorDetailsAttributes: SurvivorDetailsOnSeasonAttributes =
        await models.SurvivorDetailsOnSeason.create({
          survivorId: survivorId,
          seasonId: survivorData.seasonId,
          //TODO: Add Create Tribe API and then implement this
          originalTribeId: '7f833e71-de61-4588-8085-ee75f4542317',
          age: survivorData.age,
          description: survivorData.description,
          job: survivorData.job,
          //TODO: Fix imageUrl
          imageUrl: '/images/survivor/' + survivorId + '.jpg',
        });
      if (!transaction && t) {
        await t.commit();
      }
      return survivorHelper.buildSurvivor(
        survivorAttributes,
        survivorDetailsAttributes
      );
    }
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

async function addExistingSurvivorToSeason(
  survivorData: CreateSurvivorRequestBody
): Promise<Survivor> {
  throw new NotImplementedError(
    'Adding existing survivor to season is not implemented'
  );
}

async function getSurvivorsBySeasonId(seasonId: number): Promise<Survivor[]> {
  try {
    const survivorsDetailAttributes: SurvivorDetailsOnSeasonAttributes[] =
      await models.SurvivorDetailsOnSeason.findAll({
        where: {
          seasonId: seasonId,
        },
      });

    let survivors: Survivor[] = [];

    for (const survivorDetailAttributes of survivorsDetailAttributes) {
      const survivorId = survivorDetailAttributes.survivorId;
      const survivorAttributes: SurvivorsAttributes | null =
        await models.Survivors.findOne({
          where: {
            survivorId: survivorId,
          },
        });
      if (!survivorAttributes) {
        throw new InternalServerError(
          'SurvivorDetailsAttributes is not tied to a SurvivorAttributes'
        );
      }
      const survivor: Survivor = survivorHelper.buildSurvivor(
        survivorAttributes,
        survivorDetailAttributes
      );
      survivors.push(survivor);
    }

    return survivors;
  } catch (error) {
    throw error;
  }
}

export default survivorRepository;
