import {
  BinaryPickOptions,
  ColorPickOptions,
  PickOptionTypeEnum,
  SurvivorPickOptions,
  TribePickOptions,
} from '../../../generated-api';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { InternalServerError } from '../../../utils/errors/errors';
import survivorService from '../../season/survivorService';

const pickOptionService = {
  getPickOptions,
};

async function getPickOptions(
  pickOptionType: PickOptionTypeEnum,
  episodeId: EpisodeAttributes['episodeId']
): Promise<ColorPickOptions | TribePickOptions | SurvivorPickOptions> {
  switch (pickOptionType) {
    case PickOptionTypeEnum.Color:
      return await getColorPickOptions();
    case PickOptionTypeEnum.Survivor:
      return await getSurvivorPickOptions(episodeId);
    case PickOptionTypeEnum.Tribe:
      return await getTribePickOptions();
    default:
      throw new InternalServerError(
        `Invalid pick option type: ${pickOptionType}`
      );
  }
}

async function getSurvivorPickOptions(
  episodeId: EpisodeAttributes['episodeId']
): Promise<SurvivorPickOptions> {
  const survivorsWithEliminationStatusOnEpisode =
    await survivorService.getSurvivorsAtStartOfEpisode(episodeId);
  return survivorsWithEliminationStatusOnEpisode.filter(
    (survivor) => !survivor.eliminationInfo.isEliminated
  );
}

async function getColorPickOptions(): Promise<ColorPickOptions> {
  return [];
}

async function getTribePickOptions(): Promise<TribePickOptions> {
  return [];
}

function getBinaryPickOptions(): BinaryPickOptions[] {
  return [BinaryPickOptions.True, BinaryPickOptions.False];
}

export default pickOptionService;
