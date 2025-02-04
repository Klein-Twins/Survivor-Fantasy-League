import { SurveyPicksAttributes } from '../../../models/surveysAndPicks/SurveyPicks';
import { defaultSurveyIds } from '../foundationIds';

const surveyPicksData: SurveyPicksAttributes[] = [
  //Survey1 - a weekly survey
  {
    surveyId: defaultSurveyIds.DefaultWeeklySurvey,
    pickId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  },
  {
    surveyId: defaultSurveyIds.DefaultWeeklySurvey,
    pickId: 'b9d1c2e3-f4a5-4b7c-8d9e-0f1a2b3c4d5e',
  },
  {
    surveyId: defaultSurveyIds.DefaultWeeklySurvey,
    pickId: 'c5d6e7f8-9a0b-4c9d-b4a8-f1c2d3e4f5a6',
  },

  //Survey2 - a premier survey
  {
    surveyId: defaultSurveyIds.DefaultPremierSurvey,
    pickId: '38c3f7bc-e2c4-4c9d-b4a8-f1c2d3e4f5a6',
  },
  {
    surveyId: defaultSurveyIds.DefaultPremierSurvey,
    pickId: '7a8b9c0d-1e2f-4372-a567-0e02b2c3d479',
  },
  {
    surveyId: defaultSurveyIds.DefaultPremierSurvey,
    pickId: '550e8400-e29b-41d4-a716-446655440000',
  },
  {
    surveyId: defaultSurveyIds.DefaultPremierSurvey,
    pickId: '67f890cd-ef12-4567-89ab-cdef01234567',
  },
];

export default surveyPicksData;
