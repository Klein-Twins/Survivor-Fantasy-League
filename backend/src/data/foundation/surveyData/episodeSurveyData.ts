import { EpisodeSurveyAttributes } from '../../../models/surveyAndPick/EpisodeSurvey';
import {
  defaultSurveyIds,
  season47EpisodeIds,
  season47EpisodeSurveyIds,
  season48EpisodeIds,
  season48EpisodeSurveyIds,
} from '../foundationIds';
import season47EpisodeData from '../seasonData/47/episodeData';
import season48EpisodeData from '../seasonData/48/episodeData';

export const season47episodeSurveyData: EpisodeSurveyAttributes[] = [
  {
    surveyDefinition: defaultSurveyIds.DefaultPremierSurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode1,
    episodeId: season47EpisodeIds.episode1,
    dueDate: season47EpisodeData[0].episodeAirDate,
    openDate: new Date('2021-09-01T00:00:00.000Z'),
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode2,
    episodeId: season47EpisodeIds.episode2,
    dueDate: season47EpisodeData[1].episodeAirDate,
    openDate: season47EpisodeData[0].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode3,
    episodeId: season47EpisodeIds.episode3,
    dueDate: season47EpisodeData[2].episodeAirDate,
    openDate: season47EpisodeData[1].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode4,
    episodeId: season47EpisodeIds.episode4,
    dueDate: season47EpisodeData[3].episodeAirDate,
    openDate: season47EpisodeData[2].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode5,
    episodeId: season47EpisodeIds.episode5,
    dueDate: season47EpisodeData[4].episodeAirDate,
    openDate: season47EpisodeData[3].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode6,
    episodeId: season47EpisodeIds.episode6,
    dueDate: season47EpisodeData[5].episodeAirDate,
    openDate: season47EpisodeData[4].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode7,
    episodeId: season47EpisodeIds.episode7,
    dueDate: season47EpisodeData[6].episodeAirDate,
    openDate: season47EpisodeData[5].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode8,
    episodeId: season47EpisodeIds.episode8,
    dueDate: season47EpisodeData[7].episodeAirDate,
    openDate: season47EpisodeData[6].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode9,
    episodeId: season47EpisodeIds.episode9,
    dueDate: season47EpisodeData[8].episodeAirDate,
    openDate: season47EpisodeData[7].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode10,
    episodeId: season47EpisodeIds.episode10,
    dueDate: season47EpisodeData[9].episodeAirDate,
    openDate: season47EpisodeData[8].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode11,
    episodeId: season47EpisodeIds.episode11,
    dueDate: season47EpisodeData[10].episodeAirDate,
    openDate: season47EpisodeData[9].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode12,
    episodeId: season47EpisodeIds.episode12,
    dueDate: season47EpisodeData[11].episodeAirDate,
    openDate: season47EpisodeData[10].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode13,
    episodeId: season47EpisodeIds.episode13,
    dueDate: season47EpisodeData[12].episodeAirDate,
    openDate: season47EpisodeData[11].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season47EpisodeSurveyIds.episode14,
    episodeId: season47EpisodeIds.episode14,
    dueDate: season47EpisodeData[13].episodeAirDate,
    openDate: season47EpisodeData[12].episodeAirDate,
  },
];

export const season48episodeSurveyData: EpisodeSurveyAttributes[] = [
  {
    surveyDefinition: defaultSurveyIds.DefaultPremierSurvey,
    episodeSurveyId: season48EpisodeSurveyIds.episode1,
    episodeId: season48EpisodeIds.episode1,
    dueDate: season48EpisodeData[0].episodeAirDate,
    openDate: new Date('2021-09-01T00:00:00.000Z'),
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season48EpisodeSurveyIds.episode2,
    episodeId: season48EpisodeIds.episode2,
    dueDate: season48EpisodeData[1].episodeAirDate,
    openDate: season48EpisodeData[0].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season48EpisodeSurveyIds.episode3,
    episodeId: season48EpisodeIds.episode3,
    dueDate: season48EpisodeData[2].episodeAirDate,
    openDate: season48EpisodeData[1].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season48EpisodeSurveyIds.episode4,
    episodeId: season48EpisodeIds.episode4,
    dueDate: season48EpisodeData[3].episodeAirDate,
    openDate: season48EpisodeData[2].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season48EpisodeSurveyIds.episode5,
    episodeId: season48EpisodeIds.episode5,
    dueDate: season48EpisodeData[4].episodeAirDate,
    openDate: season48EpisodeData[3].episodeAirDate,
  },
  {
    surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
    episodeSurveyId: season48EpisodeSurveyIds.episode6,
    episodeId: season48EpisodeIds.episode6,
    dueDate:
      season48EpisodeData[5].episodeAirDate ||
      new Date(
        new Date(season48EpisodeData[5].episodeAirDate).getTime() +
          7 * 24 * 60 * 60 * 1000
      ),
    openDate: season48EpisodeData[4].episodeAirDate,
  },
  // {
  //   surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
  //   episodeSurveyId: season48EpisodeSurveyIds.episode7,
  //   episodeId: season48EpisodeIds.episode7,
  //   dueDate:
  //     season48EpisodeData[6]?.episodeAirDate ||
  //     new Date(
  //       new Date(season48EpisodeData[5].episodeAirDate).getTime() +
  //         7 * 24 * 60 * 60 * 1000
  //     ),
  //   openDate: season48EpisodeData[5].episodeAirDate,
  // },
  // {
  //   surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
  //   episodeSurveyId: season48EpisodeSurveyIds.episode8,
  //   episodeId: season48EpisodeIds.episode8,
  //   dueDate: season48EpisodeData[7].episodeAirDate,
  //   openDate: season48EpisodeData[6].episodeAirDate,
  // },
  // {
  //   surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
  //   episodeSurveyId: season48EpisodeSurveyIds.episode9,
  //   episodeId: season48EpisodeIds.episode9,
  //   dueDate: season48EpisodeData[8].episodeAirDate,
  //   openDate: season48EpisodeData[7].episodeAirDate,
  // },
  // {
  //   surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
  //   episodeSurveyId: season48EpisodeSurveyIds.episode10,
  //   episodeId: season48EpisodeIds.episode10,
  //   dueDate: season48EpisodeData[9].episodeAirDate,
  //   openDate: season48EpisodeData[8].episodeAirDate,
  // },
  // {
  //   surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
  //   episodeSurveyId: season48EpisodeSurveyIds.episode11,
  //   episodeId: season48EpisodeIds.episode11,
  //   dueDate: season48EpisodeData[10].episodeAirDate,
  //   openDate: season48EpisodeData[9].episodeAirDate,
  // },
  // {
  //   surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
  //   episodeSurveyId: season48EpisodeSurveyIds.episode12,
  //   episodeId: season48EpisodeIds.episode12,
  //   dueDate: season48EpisodeData[11].episodeAirDate,
  //   openDate: season48EpisodeData[10].episodeAirDate,
  // },
  // {
  //   surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
  //   episodeSurveyId: season48EpisodeSurveyIds.episode13,
  //   episodeId: season48EpisodeIds.episode13,
  //   dueDate: season48EpisodeData[12].episodeAirDate,
  //   openDate: season48EpisodeData[11].episodeAirDate,
  // },
  // {
  //   surveyDefinition: defaultSurveyIds.DefaultWeeklySurvey,
  //   episodeSurveyId: season48EpisodeSurveyIds.episode14,
  //   episodeId: season48EpisodeIds.episode14,
  //   dueDate: season48EpisodeData[13].episodeAirDate,
  //   openDate: season48EpisodeData[12].episodeAirDate,
  // },
];
