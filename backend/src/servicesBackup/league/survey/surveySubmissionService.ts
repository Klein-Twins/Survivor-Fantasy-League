import { SurveySubmissionStatus } from '../../../generated-api';
import { LeagueProfileAttributes } from '../../../models/league/LeagueProfile';
import { LeagueSurveyForEpisodeAttributes } from '../../../models/league/LeagueSurveysForEpisode';
import { SurveySubmissionAttributes } from '../../../models/league/SurveySubmissions';
import surveySubmissionRepository from '../../../repositoriesBackup/league/survey/surveySubmissionRepository';

const surveySubmissionService = {
  didLeagueMemberSubmitSurvey,
  getSurveySubmissionStatus,
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

async function getSurveySubmissionStatus(
  leagueProfileId: LeagueProfileAttributes['id'],
  leagueSurveyId: LeagueSurveyForEpisodeAttributes['leagueSurveyId']
): Promise<{
  surveySubmissionStatus: SurveySubmissionStatus;
  surveySubmissionAttributes: SurveySubmissionAttributes | null;
}> {
  const surveySubmissionAttributes =
    await surveySubmissionRepository.getSurveySubmission(
      leagueProfileId,
      leagueSurveyId
    );
  const surveySubmissionStatus = surveySubmissionAttributes
    ? SurveySubmissionStatus.Submitted
    : SurveySubmissionStatus.NotSubmitted;
  return {
    surveySubmissionStatus: surveySubmissionStatus,
    surveySubmissionAttributes: surveySubmissionAttributes,
  };
}

export default surveySubmissionService;
