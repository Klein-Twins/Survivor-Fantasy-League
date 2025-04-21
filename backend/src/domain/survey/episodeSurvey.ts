import { EpisodeSurveyAttributes } from '../../models/surveyAndPick/EpisodeSurvey';

export type EpisodeSurveyProperties = Omit<
  EpisodeSurveyAttributes,
  'surveyDefinition' | 'episodeId'
> & {
  surveyDefinition: any;
};
