import {
  BinaryPickOptions,
  ColorPickOptions,
  PickOptionTypeEnum,
  SurvivorPickOptions,
  TribePickOptions,
} from '../../../generated-api';
import {
  InternalServerError,
  NotImplementedError,
} from '../../../utils/errors/errors';

const pickOptionService = {
  getPickOptions,
};

async function getPickOptions(
  pickOptionType: PickOptionTypeEnum
): Promise<
  ColorPickOptions | TribePickOptions | SurvivorPickOptions | BinaryPickOptions
> {
  switch (pickOptionType) {
    case PickOptionTypeEnum.Binary:
      return await getSurvivorPickOptions();
    case PickOptionTypeEnum.Color:
      return await getColorPickOptions();
    case PickOptionTypeEnum.Survivor:
      return await getSurvivorPickOptions();
    case PickOptionTypeEnum.Tribe:
      return await getTribePickOptions();
    default:
      throw new InternalServerError(
        `Invalid pick option type: ${pickOptionType}`
      );
  }
}

async function getSurvivorPickOptions(): Promise<SurvivorPickOptions> {
  throw new NotImplementedError('getSurvivorPickOptions not implemented');
}

async function getColorPickOptions(): Promise<ColorPickOptions> {
  throw new NotImplementedError('getColorPickOptions not implemented');
}

async function getTribePickOptions(): Promise<TribePickOptions> {
  throw new NotImplementedError('getTribePickOptions not implemented');
}

async function getBinaryPickOptions(): Promise<BinaryPickOptions> {
  throw new NotImplementedError('getBinaryPickOptions not implemented');
}

export default pickOptionService;
