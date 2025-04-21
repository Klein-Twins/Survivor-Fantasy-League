import { UUID } from 'crypto';
import {
  BinaryOptionEnum,
  BinaryPickOptions,
  ColorPickOptions,
  PickIdAndPlayerChoice,
  PickOptions,
  PickOptionTypeEnum,
  SurvivorPickOptions,
  TribePickOptions,
} from '../../../generated-api';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { PicksAttributes } from '../../../models/surveyAndPick/picks/Picks';
import PickOptionsRepository from '../../../repositoriesBackup/league/survey/pick/pickOptionsRepository';
import {
  BadRequestError,
  NotImplementedError,
} from '../../../utils/errors/errors';
import survivorService from '../../season/survivorService';
import tribeService from '../../season/tribeService';
import pickService from './pickService';
import episodeService from '../../season/episodeService';

const pickOptionService = {
  getPickOptions,
  validatePicksOptions,
};

async function validatePicksOptions<Throws extends Boolean = false>(
  pickIdsAndPlayerChoices: PickIdAndPlayerChoice[],
  episodeId: EpisodeAttributes['id'],
  throws: Throws
): Promise<boolean> {
  const invalidPickOptions: PickIdAndPlayerChoice[] = [];

  for (const pickIdAndPlayerChoice of pickIdsAndPlayerChoices) {
    const pick = await pickService.getPick(
      pickIdAndPlayerChoice.pickId as UUID,
      episodeId
    );
    const pickOptionType = pick.options.pickOptionType;
    const invalidChoices: string[] = [];

    pickIdAndPlayerChoice.choice.forEach((choice) => {
      if (pickOptionType === PickOptionTypeEnum.Survivor) {
        const possibleOptions = pick.options.options as SurvivorPickOptions;
        const isValidOption = !!possibleOptions.find(
          (option) => option.id === choice
        );
        if (!isValidOption) {
          invalidChoices.push(choice);
        }
      } else if (pickOptionType === PickOptionTypeEnum.Tribe) {
        const possibleOptions = pick.options.options as TribePickOptions;
        const isValidOption = !!possibleOptions.find(
          (option) => option.id === choice
        );
        if (!isValidOption) {
          invalidChoices.push(choice);
        }
      } else {
        throw new NotImplementedError('Pick option type not implemented');
      }
    });

    if (invalidChoices.length > 0) {
      invalidPickOptions.push({
        pickId: pickIdAndPlayerChoice.pickId,
        choice: invalidChoices,
      });
    }
  }

  if (invalidPickOptions.length > 0 && throws) {
    throw new BadRequestError(
      `Invalid pick options: ${JSON.stringify(invalidPickOptions)}`
    );
  }
  return invalidPickOptions.length === 0;
}

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
  // return survivorsWithEliminationStatusOnEpisode.filter(
  //   (survivor) =>
  //     survivor.survivorStatus?.eliminationStatus.isEliminated === false
  // );

  return survivorsWithEliminationStatusOnEpisode;
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
