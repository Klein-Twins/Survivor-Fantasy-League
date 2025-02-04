import { UUID } from 'crypto';
import { models } from '../../config/db';
import logger from '../../config/logger';
import {
  BinaryOptionsEnum,
  BinaryPickOptions,
  ColorPickOptions,
  ColorsEnum,
  Pick,
  PickOptionTypeEnum,
  SurvivorPickOptions,
  Tribe,
  TribePickOptions,
} from '../../generated-api';
import errorFactory from '../../utils/errors/errorFactory';
import survivorService from '../../servicesAndHelpers/survivor/survivorService';
import survivorRepository from '../survivorRepository';
import tribeRepository from '../season/tribeRepository';
import { TribeAttributes } from '../../models/season/Tribes';
import { PicksAttributes } from '../../models/surveysAndPicks/picks/Picks';
import { PickOptionsAttributes } from '../../models/surveysAndPicks/picks/PickOptions';

const picksRepository = {
  getPickById,
};

async function getPickById(pickId: string, seasonId?: number): Promise<Pick> {
  const pickAttributes: PicksAttributes | null = await models.Picks.findOne({
    where: {
      pickId,
    },
  });

  if (!pickAttributes) {
    throw errorFactory({ message: 'Pick not found', statusCode: 404 });
  }

  const pickPointsAttributes = await models.PickPoints.findOne({
    where: {
      pickId,
    },
  });
  if (!pickPointsAttributes) {
    logger.warn(`PickPoints not found for pickId: ${pickId}`);
  }

  const pickOptions = await getPickOptions(pickAttributes.type, 47);

  const pick: Pick = {
    id: pickAttributes.pickId,
    description: pickAttributes.description,
    pickOptionType: pickAttributes.type,
    numPointsWorth: pickPointsAttributes?.points || 5,
    pickOptions: pickOptions,
  };

  return pick;
}

async function getPickOptions(
  pickOptionType: PickOptionTypeEnum,
  seasonId?: number
): Promise<SurvivorPickOptions | ColorPickOptions | TribePickOptions | BinaryPickOptions> {
  switch (pickOptionType) {
    case PickOptionTypeEnum.Survivor:
      if (!seasonId) {
        throw errorFactory({ message: 'SeasonId is required for Survivor PickOptions', statusCode: 400 });
      }
      return await getSurvivorPickOptions(seasonId);
    case PickOptionTypeEnum.Color:
      return await getColorPickOptions();
    case PickOptionTypeEnum.Tribe:
      if (!seasonId) {
        throw errorFactory({ message: 'SeasonId is required for Survivor PickOptions', statusCode: 400 });
      }
      return await getTribePickOptions(seasonId);
    case PickOptionTypeEnum.Binary:
      return await getBinaryPickOptions();
    default:
      throw errorFactory({ message: 'Invalid PickOptionType', statusCode: 400 });
  }
}

async function getSurvivorPickOptions(seasonId: number): Promise<SurvivorPickOptions> {
  return {
    options: await survivorService.getSurvivorsBySeason(seasonId),
  };
}

async function getColorPickOptions(): Promise<ColorPickOptions> {
  const pickOptionsAttributes: PickOptionsAttributes[] = await models.PickOptions.findAll({
    where: {
      type: PickOptionTypeEnum.Color,
    },
  });
  if (pickOptionsAttributes.length === 0) {
    throw errorFactory({ message: 'Color PickOptions not found', statusCode: 404 });
  }
  return {
    options: Object.values(ColorsEnum),
  };
}

async function getTribePickOptions(seasonId: number): Promise<TribePickOptions> {
  const tribes: Tribe[] = await tribeRepository.getTribesBySeasonId(seasonId);
  return {
    options: tribes,
  };
}

async function getBinaryPickOptions(): Promise<BinaryPickOptions> {
  return {
    options: Object.values(BinaryOptionsEnum),
  };
}

export default picksRepository;
