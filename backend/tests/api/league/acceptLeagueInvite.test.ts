import request from 'supertest';
import app from '../../../app';

import { Account, InviteResponse, League } from '../../../src/generated-api';
import { validateSuccessApiResponse } from '../auth/testHelper';

export async function acceptLeagueInvite({
  invitedAccount,
  league,
}: {
  invitedAccount: Account;
  league: League;
}): Promise<{
  league: League;
  inviteResponse: InviteResponse.Accept;
}> {
  const acceptLeagueInviteResponseBody = await request(app)
    .put(`/api/league/invite/${invitedAccount.profileId}/${league.seasonId}`)
    .send({
      leagueId: league.id,
      invitedProfileId: invitedAccount.profileId,
      inviteResponse: InviteResponse.Accept,
    })
    .then((response) => response.body);

  validateSuccessApiResponse(acceptLeagueInviteResponseBody);

  return {
    league: acceptLeagueInviteResponseBody.responseData.league,
    inviteResponse: acceptLeagueInviteResponseBody.responseData.inviteResponse,
  };
}

describe('acceptLeagueInvite', () => {
  it('placeholder test for acceptLeagueInvite', async () => {});
});
