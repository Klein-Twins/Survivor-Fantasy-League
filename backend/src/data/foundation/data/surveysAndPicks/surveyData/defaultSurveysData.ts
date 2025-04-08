import { EpisodeType } from '../../../../../generated-api';
import { SurveyAttributes } from '../../../../../models/surveyAndPick/Survey';
import { defaultSurveyIds } from '../ids';

const defaultSurveysData: Map<EpisodeType, SurveyAttributes> = new Map(
  Object.values(EpisodeType).map((episodeType) => {
    switch (episodeType) {
      case EpisodeType.PREMIERE:
        return [
          EpisodeType.PREMIERE,
          {
            surveyId: defaultSurveyIds.PREMIERE,
            name: 'Premier Survey',
          },
        ];
      case EpisodeType.PREMERGE:
        return [
          EpisodeType.PREMERGE,
          {
            surveyId: defaultSurveyIds['PRE-MERGE'],
            name: 'Pre-merge Survey',
          },
        ];
      case EpisodeType.TRIBELESS:
        return [
          EpisodeType.TRIBELESS,
          {
            surveyId: defaultSurveyIds.TRIBELESS,
            name: 'Tribeless Survey',
          },
        ];
      case EpisodeType.POSTMERGE:
        return [
          EpisodeType.POSTMERGE,
          {
            surveyId: defaultSurveyIds.POST_MERGE,
            name: 'Post-merge Survey',
          },
        ];
      case EpisodeType.FINALE:
        return [
          EpisodeType.FINALE,
          {
            surveyId: defaultSurveyIds.FINALE,
            name: 'Finale Survey',
          },
        ];
      case EpisodeType.FINALE1:
        return [
          EpisodeType.FINALE1,
          {
            surveyId: defaultSurveyIds.FINALE_1,
            name: 'Finale (part 1) Survey',
          },
        ];
      case EpisodeType.FINALE2:
        return [
          EpisodeType.FINALE2,
          {
            surveyId: defaultSurveyIds.FINALE_2,
            name: 'Finale (part 2) Survey',
          },
        ];
    }
  })
);

export default defaultSurveysData;
