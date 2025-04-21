import { Pick, Survey } from '../../../generated-api';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { SurveyAttributes } from '../../../models/surveyAndPick/Survey';
import surveyRepository from '../../../repositoriesBackup/league/survey/surveyRepository';
import { NotFoundError } from '../../../utils/errors/errors';
import pickService from './pickService';

const surveyService = {
  getSurveyDefinition,
  buildSurvey,
};

async function getSurveyDefinition(
  surveyId: SurveyAttributes['surveyId'],
  episodeId: EpisodeAttributes['id']
): Promise<Survey> {
  const surveyAttributes = await surveyRepository.getSurvey(surveyId);
  if (!surveyAttributes) {
    throw new NotFoundError(`Survey not found for surveyId: ${surveyId}`);
  }

  const picks = await pickService.getPicksForSurvey(surveyId, episodeId);

  return buildSurvey(surveyAttributes, picks);
}

function buildSurvey(
  surveyAttributes: SurveyAttributes,
  picks: Pick[]
): Survey {
  return {
    surveyDefinitionId: surveyAttributes.surveyId,
    picks,
  };
}

export default surveyService;
