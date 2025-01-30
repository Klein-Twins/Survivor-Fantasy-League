import { validate } from 'uuid';
import errorFactory from '../../utils/errors/errorFactory';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';
import leagueMemberService from './leagueMemberService';
import episodeService from '../season/episodeService';

const surveyHelper = {
  validateGetSurveyForLeagueMemberForEpisodeRequest,
};

async function validateGetSurveyForLeagueMemberForEpisodeRequest(
  leagueId: string,
  leagueProfileId: string,
  episodeId: string
): Promise<void> {
  //If leagueId is not a UUID
  if (!leagueId || leagueId.length === 0) {
    throw errorFactory({ error: 'Missing leagueId query parameter', statusCode: 400 });
  }
  if (validate(leagueId) === false) {
    throw errorFactory({ error: 'Invalid leagueId query parameter', statusCode: 400 });
  }

  //If leagueProfileId is not a UUID
  if (!leagueProfileId || leagueProfileId.length === 0) {
    throw errorFactory({ error: 'Missing leagueProfileId query parameter', statusCode: 400 });
  }
  if (validate(leagueProfileId) === false) {
    throw errorFactory({ error: 'Invalid leagueProfileId query parameter', statusCode: 400 });
  }

  //If episodeId is not a UUID
  if (!episodeId || episodeId.length === 0) {
    throw errorFactory({ error: 'Missing episodeId query parameter', statusCode: 400 });
  }
  if (validate(episodeId) === false) {
    throw errorFactory({ error: 'Invalid episodeId query parameter', statusCode: 400 });
  }

  //If leagueProfileId is not in league
  if (!(await leagueMemberService.isProfileInLeague(leagueId, leagueProfileId))) {
    throw errorFactory({ error: 'Profile is not in league', statusCode: 400 });
  }

  //Does episode exist
  if (!(await episodeService.doesEpisodeExist(episodeId))) {
    throw errorFactory({ error: 'Episode does not exist', statusCode: 400 });
  }
}

export default surveyHelper;
