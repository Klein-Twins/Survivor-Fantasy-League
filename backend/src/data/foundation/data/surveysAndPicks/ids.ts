import { EpisodeType } from '../../../../generated-api';
import { SurveyAttributes } from '../../../../models/surveyAndPick/Survey';

export const defaultSurveyIds: Record<
  EpisodeType,
  SurveyAttributes['surveyId']
> = {
  [EpisodeType.PREMIERE]: '67e55044-10b1-426f-9247-bb680e5fe0c8', // Default Premier Survey
  [EpisodeType.PREMERGE]: '550e8400-e29b-41d4-a716-446655440000', // Default Weekly Survey (Pre-Merge)
  [EpisodeType.TRIBELESS]: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Tribeless Survey
  [EpisodeType.POSTMERGE]: 'b2c3d4e5-f6a7-8901-2345-678901abcdef', // Default Weekly Survey (Post-Merge)
  [EpisodeType.FINALE]: 'c3d4e5f6-a7b8-9012-3456-789012abcdef', // Finale Survey
  [EpisodeType.FINALE1]: 'd4e5f6a7-b8c9-0123-4567-890123abcdef', // Finale Part 1 Survey
  [EpisodeType.FINALE2]: 'e5f6a7b8-c9d0-1234-5678-901234abcdef', // Finale Part 2 Survey
};
