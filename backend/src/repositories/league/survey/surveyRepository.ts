import { models } from '../../../config/db';
import { SurveyAttributes } from '../../../models/surveyAndPick/Survey';

const surveyRepository = {
  getSurvey,
};

async function getSurvey(
  surveyId: SurveyAttributes['surveyId']
): Promise<SurveyAttributes | null> {
  return await models.Survey.findByPk(surveyId);
}

export default surveyRepository;
