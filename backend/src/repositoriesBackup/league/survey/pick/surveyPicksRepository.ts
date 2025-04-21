import { models } from '../../../../config/db';
import { SurveyAttributes } from '../../../../models/surveyAndPick/Survey';
import { SurveyPicksAttributes } from '../../../../models/surveyAndPick/SurveyPicks';

const surveyPicksRepository = {
  getSurveyPicks,
};

async function getSurveyPicks(
  surveyDefinitionId: SurveyAttributes['surveyId']
): Promise<SurveyPicksAttributes[]> {
  const surveyPicks = await models.SurveyPicks.findAll({
    where: {
      surveyId: surveyDefinitionId,
    },
  });
  return surveyPicks;
}

export default surveyPicksRepository;
