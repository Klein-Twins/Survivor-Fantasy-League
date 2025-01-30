import { Episode, GetSurveyForEpisodeForLeagueMemberResponseData } from '../../generated-api';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';
import leagueMemberService from './leagueMemberService';
import surveyHelper from './surveyHelper';

const surveyService = {
  getSurveyForLeagueMember,
};

async function getSurveyForLeagueMember(
  leagueId: string,
  leagueProfileId: string,
  episodeId: string
): Promise<GetSurveyForEpisodeForLeagueMemberResponseData | null> {
  await surveyHelper.validateGetSurveyForLeagueMemberForEpisodeRequest(leagueId, leagueProfileId, episodeId);
  return null;
  //   await leagueMemberService.

  //If leagueProfileId is not associated with the leagueId || inviteState != 'ACCEPTED'
}

export default surveyService;
