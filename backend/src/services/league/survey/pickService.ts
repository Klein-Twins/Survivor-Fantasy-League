import {
  BinaryPickOptions,
  ColorPickOptions,
  Pick,
  SurvivorPickOptions,
  TribePickOptions,
} from '../../../generated-api';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { PicksAttributes } from '../../../models/surveyAndPick/picks/Picks';
import { SurveyAttributes } from '../../../models/surveyAndPick/Survey';
import pickRepository from '../../../repositories/league/survey/pick/pickRepository';
import surveyPicksRepository from '../../../repositories/league/survey/pick/surveyPicksRepository';
import { NotFoundError } from '../../../utils/errors/errors';
import pickOptionService from './pickOptionService';

const pickService = {
  getPicksForSurvey,
};

async function getPick(
  pickId: PicksAttributes['pickId'],
  episodeId: EpisodeAttributes['episodeId']
): Promise<Pick> {
  const pickAttributes = await pickRepository.getPick(pickId);
  if (!pickAttributes) {
    throw new NotFoundError(`Pick not found for pickId: ${pickId}`);
  }

  const pickOptions = await pickOptionService.getPickOptions(
    pickAttributes.type
  );

  return buildPick(pickAttributes, pickOptions);
}

async function getPicksForSurvey(
  surveyId: SurveyAttributes['surveyId'],
  episodeId: EpisodeAttributes['episodeId']
): Promise<Pick[]> {
  const surveyPicksAttributes = await surveyPicksRepository.getSurveyPicks(
    surveyId
  );
  if (surveyPicksAttributes.length === 0) {
    throw new NotFoundError(`No picks found for surveyId: ${surveyId}`);
  }

  const picks: Pick[] = await Promise.all(
    surveyPicksAttributes.map(async (surveyPickAttributes) => {
      return await getPick(surveyPickAttributes.pickId, episodeId);
    })
  );

  return picks;
}

function buildPick(
  pickAttributes: PicksAttributes,
  pickOptions:
    | SurvivorPickOptions
    | ColorPickOptions
    | TribePickOptions
    | BinaryPickOptions
): Pick {
  return {
    id: pickAttributes.pickId,
    description: pickAttributes.description,
    optionType: pickAttributes.type,
    pointValue: 5,
    options: pickOptions,
  };
}

export default pickService;
