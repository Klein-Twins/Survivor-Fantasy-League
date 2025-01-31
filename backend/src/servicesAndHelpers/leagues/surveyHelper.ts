import { validate } from 'uuid';
import errorFactory from '../../utils/errors/errorFactory';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';
import leagueMemberService from './leagueMemberService';
import episodeService from '../season/episodeService';

const surveyHelper = {
  validateGetSurveyRequest,
};

async function validateGetSurveyRequest(leagueId: string, profileIds: string[], episodeIds: string[]): Promise<void> {
  // Validate leagueId
  if (!leagueId) {
    throw errorFactory({ error: 'Missing leagueId parameter', statusCode: 400 });
  }
  if (!validate(leagueId)) {
    throw errorFactory({ error: 'Invalid leagueId parameter', statusCode: 400 });
  }

  // Validate profileIds array
  if (!profileIds || profileIds.length === 0) {
    throw errorFactory({ error: 'Missing profileIds parameter', statusCode: 400 });
  }
  if (profileIds.some((id) => !validate(id))) {
    throw errorFactory({ error: 'Invalid profileId format in array', statusCode: 400 });
  }

  // Validate episodeIds array
  if (!episodeIds || episodeIds.length === 0) {
    throw errorFactory({ error: 'Missing episodeIds parameter', statusCode: 400 });
  }
  if (episodeIds.some((id) => !validate(id))) {
    throw errorFactory({ error: 'Invalid episodeId format in array', statusCode: 400 });
  }
}
export default surveyHelper;
