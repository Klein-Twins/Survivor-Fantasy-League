import { SurveyAttributes } from '../../../models/surveyAndPick/Survey';
import { defaultSurveyIds } from '../foundationIds';

const defaultSurveysData: SurveyAttributes[] = [
  {
    surveyId: defaultSurveyIds.DefaultWeeklySurvey,
    name: 'This is a test weekly survey!',
  },
  {
    surveyId: defaultSurveyIds.DefaultPremierSurvey,
    name: 'This is a test premier survey!',
  },
];

export default defaultSurveysData;
