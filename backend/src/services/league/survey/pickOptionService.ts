import {
  BinaryPickOptions,
  ColorPickOptions,
  PickOptionTypeEnum,
  SurvivorPickOptions,
  TribePickOptions,
} from '../../../generated-api';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import {
  InternalServerError,
  NotImplementedError,
} from '../../../utils/errors/errors';
import episodeService from '../../season/episodeService';
import survivorService from '../../season/survivorService';
import tribeMemberService from '../../season/tribeMemberService';
import tribeService from '../../season/tribeService';

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
      return await getTribePickOptions(episodeId);
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

async function getTribePickOptions(
  episodeId: EpisodeAttributes['episodeId']
): Promise<TribePickOptions> {
  const episode = await episodeService.getEpisode('episodeId', episodeId);
  const tribes = await tribeService.getTribesOnEpisode(episodeId);
  return tribes;
}

function getBinaryPickOptions(): BinaryPickOptions[] {
  return [BinaryPickOptions.True, BinaryPickOptions.False];
}

export default pickOptionService;
