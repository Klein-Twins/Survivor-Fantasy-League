import { validate } from 'uuid';
import errorFactory from '../../utils/errors/errorFactory';
import { League, SurveyType } from '../../generated-api';
import leagueRepository from '../../repositories/leagueRepository';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';

async function validateGetLeaguePicksRequest(leagueId: string, surveyType: string, profileId: string): Promise<void> {
  //If leagueId is invalid (not a UUID)
  if (!leagueId || leagueId.length === 0) {
    throw errorFactory({ error: 'Missing leagueId query parameter', statusCode: 400 });
  }
  if (validate(leagueId) === false) {
    throw errorFactory({ error: 'Invalid leagueId query parameter', statusCode: 400 });
  }

  //If surveyType is invalid (not a valid survey type)
  if (surveyType && !Object.values(SurveyType).includes(surveyType as SurveyType)) {
    throw errorFactory({ error: 'Invalid surveyType query parameter', statusCode: 400 });
  }

  //If leagueId is not associated with a league
  const league: League | null = await leagueRepository.getLeagueByLeagueId(leagueId);
  if (!league) {
    throw errorFactory({ error: 'League not found', statusCode: 404 });
  }

  //If profileId is not associated with the league.
  const isProfileInLeague: boolean = await leagueMemberRepository.isUserInLeague(leagueId, profileId);
  if (!isProfileInLeague) {
    throw errorFactory({ error: 'Profile is not in league', statusCode: 403 });
  }
}

const leaguePicksHelper = {
  validateGetLeaguePicksRequest,
};

export default leaguePicksHelper;
