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
import survivorService from '../../servicesAndHelpersBackup/survivor/survivorService';

import { TribeAttributes } from '../../models/season/Tribes';
import { PicksAttributes } from '../../models/surveyAndPick/picks/Picks';
import { PickOptionsAttributes } from '../../models/surveyAndPick/picks/PickOptions';
import { BadRequestError, NotFoundError } from '../../utils/errors/errors';
import tribeRepository from '../../repositoriesBackup/season/tribeRepository';

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
    throw new NotFoundError(`Pick not found for pickId: ${pickId}`);
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
): Promise<
  SurvivorPickOptions | ColorPickOptions | TribePickOptions | BinaryPickOptions
> {
  switch (pickOptionType) {
    case PickOptionTypeEnum.Survivor:
      if (!seasonId) {
        throw new BadRequestError(
          'SeasonId is required for Survivor PickOptions'
        );
      }
      return await getSurvivorPickOptions(seasonId);
    case PickOptionTypeEnum.Color:
      return await getColorPickOptions();
    case PickOptionTypeEnum.Tribe:
      if (!seasonId) {
        throw new BadRequestError('SeasonId is required for Tribe PickOptions');
      }
      return await getTribePickOptions(seasonId);
    case PickOptionTypeEnum.Binary:
      return await getBinaryPickOptions();
    default:
      throw new BadRequestError('Invalid PickOptionType');
  }
}

async function getSurvivorPickOptions(
  seasonId: number
): Promise<SurvivorPickOptions> {
  return {
    options: await survivorService.getSurvivorsBySeason(seasonId),
  };
}

async function getColorPickOptions(): Promise<ColorPickOptions> {
  const pickOptionsAttributes: PickOptionsAttributes[] =
    await models.PickOptions.findAll({
      where: {
        type: PickOptionTypeEnum.Color,
      },
    });
  if (pickOptionsAttributes.length === 0) {
    throw new NotFoundError('Color PickOptions not found');
  }
  return {
    options: Object.values(ColorsEnum),
  };
}

async function getTribePickOptions(
  seasonId: number
): Promise<TribePickOptions> {
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
