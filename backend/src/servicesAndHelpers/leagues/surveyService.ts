import { LeagueSurvey } from '../../generated-api';
import surveyRepository from '../../repositories/surveyRepository';
import episodeService from '../season/episodeService';
import leagueMemberService from './leagueMemberService';
import leagueService from './leagueService';
import surveyHelper from './surveyHelper';

const surveyService = {
  getSurveys,
};

async function getSurveys(leagueId: string, profileIds: string[], episodeNumbers: number[]): Promise<LeagueSurvey[]> {
  // Validate inputs
  await surveyHelper.validateGetSurveyRequest(leagueId, profileIds, episodeNumbers);

  // Validate League Exists
  await leagueService.validateLeagueExists(leagueId);

  // Verify all profileIds are members of league with ACCEPTED status
  profileIds.map(async (profileId) => {
    await leagueMemberService.validateProfileIsInLeague(leagueId, profileId);
  });

  const seasonId = (await leagueService.getLeagueByLeagueId(leagueId)).season.id;
  const episodeIds = await episodeService.getEpisodeIdsBySeasonAndEpisodeNumber(seasonId, episodeNumbers);

  let surveys: LeagueSurvey[] = [];
  // TODO: Get picks for each episode
  for (const profileId of profileIds) {
    for (const episodeId of episodeIds) {
      surveys = surveys.concat(await surveyRepository.getLeagueSurvey(leagueId, profileId, episodeId));
    }
  }

  return surveys;
}

export default surveyService;
