import {
  BinaryOptionEnum,
  BinaryPickOptions,
  ColorPickOptions,
  PickOptions,
  PickOptionTypeEnum,
  SurvivorPickOptions,
  TribePickOptions,
} from '../../../generated-api';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { PicksAttributes } from '../../../models/surveyAndPick/picks/Picks';
import PickOptionsRepository from '../../../repositories/league/survey/pick/pickOptionsRepository';
import { NotImplementedError } from '../../../utils/errors/errors';
import episodeService from '../../season/episodeService';
import survivorService from '../../season/survivorService';
import tribeService from '../../season/tribeService';

const pickOptionService = {
  getPickOptions,
};

async function getPickOptions(
  pickId: PicksAttributes['pickId'],
  episodeId: EpisodeAttributes['id']
): Promise<PickOptions> {
  const pickOptionsAttributes = await PickOptionsRepository.getPickOptions(
    pickId
  );

  const options =
    pickOptionsAttributes.type === PickOptionTypeEnum.Survivor
      ? await getSurvivorPickOptions(episodeId)
      : pickOptionsAttributes.type === PickOptionTypeEnum.Tribe
      ? await getTribePickOptions(episodeId)
      : pickOptionsAttributes.type === PickOptionTypeEnum.Color
      ? await getColorPickOptions()
      : pickOptionsAttributes.type === PickOptionTypeEnum.Binary
      ? await getBinaryPickOptions()
      : null;

  if (!options) {
    throw new NotImplementedError(
      `Pick option type ${pickOptionsAttributes.type} not implemented`
    );
  }

  return {
    pickOptionType: pickOptionsAttributes.type,
    minNumSelections: pickOptionsAttributes.minNumSelections,
    maxNumSelections: pickOptionsAttributes.maxNumSelections,
    noneOptionAllowed: pickOptionsAttributes.noneOptionAllowed,
    options: options,
  };
}

async function getSurvivorPickOptions(
  episodeId: EpisodeAttributes['id']
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
  episodeId: EpisodeAttributes['id']
): Promise<TribePickOptions> {
  const episode = await episodeService.getEpisode('episodeId', episodeId);
  const tribes = await tribeService.getTribesOnEpisode(episodeId);
  return tribes;
}

function getBinaryPickOptions(): BinaryPickOptions {
  return Object.values(BinaryOptionEnum) as BinaryPickOptions;
}

export default pickOptionService;
