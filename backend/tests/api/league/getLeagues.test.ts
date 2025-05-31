import request from 'supertest';
import app from '../../../app';
import { Account } from '../../../src/generated-api';
import { validateSuccessApiResponse } from '../auth/testHelper';
import { createLeague } from './createLeague.test';
import { inviteToLeague } from './sendLeagueInvite.test';
import { UUID } from 'crypto';
import { acceptLeagueInvite } from './acceptLeagueInvite.test';

describe('GET /api/league/:profileId/:seasonId', () => {
  let accountWithNoLeagues: Account;
  let accountWith1Leagues: Account;
  let accountWith2Leagues: Account;
  beforeAll(async () => {
    const accountWithNoLeaguesSignupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'LittleBobby@testing.com',
        password: 'StrongPassword123!',
        userName: 'LittleBobby',
        firstName: 'Little',
        lastName: 'Bobby',
      });
    validateSuccessApiResponse(accountWithNoLeaguesSignupResponse.body);
    accountWithNoLeagues =
      accountWithNoLeaguesSignupResponse.body.responseData.account;

    const accountWith1LeaguesSignupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'CarlFrankman@testing.com',
        password: 'AnotherStrongPassword456!',
        userName: 'carlFrankman',
        firstName: 'Carl',
        lastName: 'Frankman',
      });
    validateSuccessApiResponse(accountWith1LeaguesSignupResponse.body);
    accountWith1Leagues =
      accountWith1LeaguesSignupResponse.body.responseData.account;

    const carlFrankmanLeague = await createLeague({
      account: accountWith1Leagues,
      leagueName: 'Carl Frankman league',
      seasonId: 48,
    }).then((response) => response.responseData.league);

    const accountWith2LeaguesSignupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'GarySmallman@testing.com',
        password: 'YetAnotherStrongPassword789!',
        userName: 'garySmallman',
        firstName: 'Gary',
        lastName: 'Smallman',
      });
    validateSuccessApiResponse(accountWith2LeaguesSignupResponse.body);
    accountWith2Leagues =
      accountWith2LeaguesSignupResponse.body.responseData.account;

    const GarySmallmanLeague = await createLeague({
      account: accountWith2Leagues,
      leagueName: 'Gary Smallman league 1',
      seasonId: 48,
    }).then((response) => response.responseData.league);

    await inviteToLeague({
      inviterAccount: accountWith1Leagues,
      invitedAccount: accountWith2Leagues,
      leagueId: carlFrankmanLeague.id as UUID,
    });

    await acceptLeagueInvite({
      invitedAccount: accountWith2Leagues,
      league: carlFrankmanLeague,
    });
  });

  describe('Should get 0 leagues successfully', () => {
    it('should return an empty array of leagues for an account with no leagues', async () => {
      const getLeaguesResponse = await request(app)
        .get(`/api/league/${accountWithNoLeagues.profileId}/48`)
        .then((response) => response.body);

      validateSuccessApiResponse(getLeaguesResponse);
      expect(getLeaguesResponse.responseData.leagues).toEqual([]);
    });
  });

  describe('Should get 1 league successfully', () => {
    it('should return an array with 1 league for an account with 1 league', async () => {
      const getLeaguesResponse = await request(app)
        .get(`/api/league/${accountWith1Leagues.profileId}/48`)
        .then((response) => response.body);

      validateSuccessApiResponse(getLeaguesResponse);
      expect(getLeaguesResponse.responseData.leagues).toHaveLength(1);
      expect(getLeaguesResponse.responseData.leagues[0].name).toBe(
        'Carl Frankman league'
      );
    });
  });

  describe('Should get 2 leagues successfully even if one is from joining (not creation)', () => {
    it('should return an array with 2 leagues for an account with 2 leagues', async () => {
      const getLeaguesResponse = await request(app)
        .get(`/api/league/${accountWith2Leagues.profileId}/48`)
        .then((response) => response.body);

      validateSuccessApiResponse(getLeaguesResponse);
      expect(getLeaguesResponse.responseData.leagues).toHaveLength(2);
      expect(getLeaguesResponse.responseData.leagues[0].name).toBe(
        'Gary Smallman league 1'
      );
      expect(getLeaguesResponse.responseData.leagues[1].name).toBe(
        'Carl Frankman league'
      );
      expect(
        getLeaguesResponse.responseData.leagues[1].leagueMembers
      ).toHaveLength(2);
    });
  });
});
