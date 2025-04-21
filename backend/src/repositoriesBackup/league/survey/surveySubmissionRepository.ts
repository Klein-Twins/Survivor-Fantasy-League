import { models } from '../../../config/db';
import { LeagueProfileAttributes } from '../../../models/league/LeagueProfile';
import { LeagueSurveyForEpisodeAttributes } from '../../../models/league/LeagueSurveysForEpisode';
import { SurveySubmissionAttributes } from '../../../models/league/SurveySubmissions';

const surveySubmissionRepository = {
  getSurveySubmission,
};

async function getSurveySubmission(
  leagueProfileId: LeagueProfileAttributes['id'],
  leagueSurveyId: LeagueSurveyForEpisodeAttributes['leagueSurveyId']
): Promise<SurveySubmissionAttributes | null> {
  const surveySubmission = await models.SurveySubmissions.findOne({
    where: {
      leagueProfileId,
      leagueSurveyId,
    },
  });
  return surveySubmission;
}

export default surveySubmissionRepository;
