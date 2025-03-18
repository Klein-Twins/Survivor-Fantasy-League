import { LeagueProfileAttributes } from '../../../models/league/LeagueProfile';
import { LeagueSurveyForEpisodeAttributes } from '../../../models/league/LeagueSurveysForEpisode';
import surveySubmissionRepository from '../../../repositories/league/survey/surveySubmissionRepository';

const surveySubmissionService = {
  didLeagueMemberSubmitSurvey,
};

async function didLeagueMemberSubmitSurvey(
  leagueMemberSurveyId: LeagueSurveyForEpisodeAttributes['leagueSurveyId'],
  leagueProfileId: LeagueProfileAttributes['id']
) {
  const surveySubmission = await surveySubmissionRepository.getSurveySubmission(
    leagueProfileId,
    leagueMemberSurveyId
  );
  return !!surveySubmission;
}

export default surveySubmissionService;
