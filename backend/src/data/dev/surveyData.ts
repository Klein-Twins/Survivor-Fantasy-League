import { SurveyAttributes } from '../../models/SurveysAndPicks/Survey';
import { SurveyPicksAttributes } from '../../models/SurveysAndPicks/SurveyPicks';

const surveys: SurveyAttributes[] = [
  {
    surveyId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'This is a test weekly survey!',
  },
  {
    surveyId: '67e55044-10b1-426f-9247-bb680e5fe0c8',
    name: 'This is a test premier survey!',
  },
];

const surveyPicks: SurveyPicksAttributes[] = [
  //Survey1 - a weekly survey
  {
    surveyId: '550e8400-e29b-41d4-a716-446655440000',
    pickId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  },
  {
    surveyId: '550e8400-e29b-41d4-a716-446655440000',
    pickId: 'b9d1c2e3-f4a5-4b7c-8d9e-0f1a2b3c4d5e',
  },
  {
    surveyId: '550e8400-e29b-41d4-a716-446655440000',
    pickId: 'c5d6e7f8-9a0b-4c9d-b4a8-f1c2d3e4f5a6',
  },

  //Survey2 - a premier survey
  {
    surveyId: '67e55044-10b1-426f-9247-bb680e5fe0c8',
    pickId: '38c3f7bc-e2c4-4c9d-b4a8-f1c2d3e4f5a6',
  },
  {
    surveyId: '67e55044-10b1-426f-9247-bb680e5fe0c8',
    pickId: '7a8b9c0d-1e2f-4372-a567-0e02b2c3d479',
  },
  {
    surveyId: '67e55044-10b1-426f-9247-bb680e5fe0c8',
    pickId: '550e8400-e29b-41d4-a716-446655440000',
  },
  {
    surveyId: '67e55044-10b1-426f-9247-bb680e5fe0c8',
    pickId: '67f890cd-ef12-4567-89ab-cdef01234567',
  },
];

const surveyData = {
  surveys,
  surveyPicks,
};

export default surveyData;
