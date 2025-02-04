import { models } from '../config/db';
import logger from '../config/logger';
import { SurvivorDetailsOnSeasonAttributes } from '../models/survivors/SurvivorDetailsOnSeason';
import { Survivor, SurvivorBasic } from '../generated-api';
import { SurvivorsAttributes } from '../models/survivors/Survivors';
import { NotFoundError } from '../utils/errors/errors';

const survivorRepository = {
  getSurvivorsBySeasonId,
  getBasicSurvivorsBySeason,
};

function buildSurvivor(
  survivorAttributes: SurvivorsAttributes,
  SurvivorDetailsOnSeason: SurvivorDetailsOnSeasonAttributes
): Survivor {
  return {
    survivorId: survivorAttributes.survivorId,
    firstName: survivorAttributes.firstName,
    lastName: survivorAttributes.lastName,
    fromCity: survivorAttributes.fromCity,
    fromState: survivorAttributes.fromState,
    fromCountry: survivorAttributes.fromCountry,
    nickName: survivorAttributes.nickName,
    seasonId: SurvivorDetailsOnSeason.seasonId,
    age: SurvivorDetailsOnSeason.age,
    description: SurvivorDetailsOnSeason.description,
    job: SurvivorDetailsOnSeason.job,
    imageUrl: SurvivorDetailsOnSeason.imageUrl,
  };
}

function buildBasicSurvivor(survivorAttributes: SurvivorsAttributes): SurvivorBasic {
  return {
    survivorId: survivorAttributes.survivorId,
    firstName: survivorAttributes.firstName,
    lastName: survivorAttributes.lastName,
  };
}

async function getSurvivorBasicBySurvivorId(survivorId: string): Promise<SurvivorBasic | null> {
  const survivorAttributes: SurvivorsAttributes | null = await models.Survivors.findOne({
    where: {
      survivorId: survivorId,
    },
  });

  if (!survivorAttributes) {
    logger.error(`No survivor found for survivorId ${survivorId}`);
    return null;
  }

  return buildBasicSurvivor(survivorAttributes);
}

async function getSurvivorBySurvivorId(survivorId: string): Promise<Survivor | null> {
  try {
    const survivorAttributes: SurvivorsAttributes | null = await models.Survivors.findOne({
      where: {
        survivorId: survivorId,
      },
    });
    if (!survivorAttributes) {
      logger.error(`No survivor found for survivorId ${survivorId}`);
      return null;
    }

    const SurvivorDetailsOnSeason: SurvivorDetailsOnSeasonAttributes | null =
      await models.SurvivorDetailsOnSeason.findOne({
        where: {
          survivorId: survivorId,
        },
      });
    if (!SurvivorDetailsOnSeason) {
      logger.error(`No survivor details found for survivorId ${survivorId}`);
      return null;
    }

    return buildSurvivor(survivorAttributes, SurvivorDetailsOnSeason);
  } catch (error) {
    logger.error(`Error retrieving survivor from DB for survivorId ${survivorId}: ${error}`);
    throw error;
  }
}

async function getSurvivorsBySeasonId(seasonId: number): Promise<Survivor[]> {
  try {
    const survivorsDetailAttributes: SurvivorDetailsOnSeasonAttributes[] = await models.SurvivorDetailsOnSeason.findAll(
      {
        where: {
          seasonId: seasonId,
        },
      }
    );

    let survivors: Survivor[] = [];
    for (const survivorDetailAttributes of survivorsDetailAttributes) {
      const survivorId = survivorDetailAttributes.survivorId;
      const survivor: Survivor | null = await getSurvivorBySurvivorId(survivorId);
      if (survivor) {
        survivors.push(survivor);
      } else {
        logger.error(`No survivor found for survivorId ${survivorId}`);
      }
    }
    return survivors;
  } catch (error) {
    logger.error(`Error retrieving survivors from DB for season ${seasonId}: ${error}`);
    throw error;
  }
}

async function getBasicSurvivorsBySeason(seasonId: number): Promise<SurvivorBasic[]> {
  const survivorsDetailAttributes: SurvivorDetailsOnSeasonAttributes[] = await models.SurvivorDetailsOnSeason.findAll({
    where: {
      seasonId: seasonId,
    },
  });

  if (!survivorsDetailAttributes) {
    logger.error(`No survivors found for seasonId ${seasonId}`);
    throw new NotFoundError(`No survivors found for seasonId ${seasonId}`);
  }

  let survivors: SurvivorBasic[] = [];
  for (const survivorDetailAttributes of survivorsDetailAttributes) {
    const survivorId = survivorDetailAttributes.survivorId;
    const survivor: SurvivorBasic | null = await getSurvivorBasicBySurvivorId(survivorId);
    if (survivor) {
      survivors.push(survivor);
    } else {
      logger.error(`No survivor found for survivorId ${survivorId}`);
    }
  }

  return survivors;
}

export default survivorRepository;
