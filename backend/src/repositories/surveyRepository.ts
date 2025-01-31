import { models } from '../config/db';
import { LeagueSurvey } from '../generated-api';
import { LeagueSurveyAttributes } from '../models/League/LeagueSurvey';
import leagueMemberService from '../servicesAndHelpers/leagues/leagueMemberService';
import errorFactory from '../utils/errors/errorFactory';

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

  throw errorFactory({ message: 'Not implemented', statusCode: 501 });
}
export default surveyRepository;
