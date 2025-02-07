import { models } from '../../../../config/db';
import {
  BinaryOptionsEnum,
  BinaryPickOptions,
  ColorPickOptions,
  ColorsEnum,
  PickOptionTypeEnum,
  SurvivorPickOptions,
  Tribe,
  TribePickOptions,
} from '../../../../generated-api';
import { PickOptionsAttributes } from '../../../../models/surveysAndPicks/picks/PickOptions';
import tribeService from '../../../../services/season/tribeService';
import survivorService from '../../../../services/survivor/survivorService';
import {
  BadRequestError,
  NotFoundError,
} from '../../../../utils/errors/errors';

const pickOptionsRepository = {
  getPickOptions,
};

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
    //TODO: Add signautre for single seasonId
    options: await survivorService.getSurvivorsBySeason([seasonId]),
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
  const tribes: Tribe[] = await tribeService.getTribes(seasonId);
  return {
    options: tribes,
  };
}

async function getBinaryPickOptions(): Promise<BinaryPickOptions> {
  return {
    options: Object.values(BinaryOptionsEnum),
  };
}

export default pickOptionsRepository;
