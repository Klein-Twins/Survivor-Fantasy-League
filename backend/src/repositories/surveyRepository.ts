import { UUID } from 'crypto';
import { models } from '../config/db';
import {
  LeagueSurvey,
  Pick,
  SurveyAvailabilityStatusEnum,
  SurveySubmissionStatusEnum,
  SurveyType,
} from '../generated-api';
import { LeagueSurveyAttributes } from '../models/league/LeagueSurveys';
import { SurveyPicksAttributes } from '../models/surveysAndPicks/SurveyPicks';
import leagueMemberService from '../servicesAndHelpers/leagues/leagueMemberService';
import picksService from '../servicesAndHelpers/picks/picksService';
import episodeService from '../servicesAndHelpers/season/episodeService';
import errorFactory from '../utils/errors/errorFactory';
import { SurveyAttributes } from '../models/surveysAndPicks/Survey';

const surveyRepository = {
  getLeagueSurvey,
};

async function getLeagueSurvey(leagueId: string, profileId: string, episodeId: string): Promise<LeagueSurvey> {
  const leagueSurveyAttributes: LeagueSurveyAttributes | null = await models.LeagueSurveys.findOne({
    where: {
      leagueId,
      episodeId,
    },
  });

  if (!leagueSurveyAttributes) {
    throw errorFactory({ message: 'League Survey not found', statusCode: 404 });
  }

  const leagueSurveyId = leagueSurveyAttributes.leagueSurveyId;
  const surveyId = leagueSurveyAttributes.surveyId;

  const surveyAttributes: SurveyAttributes | null = await models.Survey.findOne({
    where: {
      surveyId,
    },
  });

  if (!surveyAttributes) {
    throw errorFactory({ message: 'Survey not found', statusCode: 404 });
  }

  const episode = await episodeService.getEpisode(episodeId);

  const surveyPickAttributes: SurveyPicksAttributes[] = await models.SurveyPicks.findAll({
    where: {
      surveyId,
    },
  });
  const surveyPickIds: UUID[] = surveyPickAttributes.map((surveyPick) => surveyPick.pickId);

  const picks: Pick[] = await Promise.all(surveyPickIds.map((pickId) => picksService.getPickById(pickId)));

  const leagueSurvey: LeagueSurvey = {
    leagueSurveyId: leagueSurveyId,
    surveyId: surveyId,
    episode: episode,
    picks: picks,
    surveyType: episode.episodeNumber === 0 ? SurveyType.Premier : SurveyType.Weekly,
    surveyAvailabilityStatus: SurveyAvailabilityStatusEnum.Available,
    surveySubmissionStatus: SurveySubmissionStatusEnum.InProgress,
  };

  return leagueSurvey;
}
export default surveyRepository;
