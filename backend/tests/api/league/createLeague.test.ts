import request from 'supertest';
import app from '../../../app';
import { validateSuccessApiResponse } from '../auth/testHelper';
import {
  Account,
  CreateLeagueResponse,
  League,
  LeagueMember,
  LeagueMemberRole,
} from '../../../src/generated-api';
import { expectUUID } from '../../utils/uuidValidator';
import { models } from '../../../src/config/db';
import { LeagueProfileAttributes } from '../../../src/models/league/LeagueProfile';
import { LeagueAttributes } from '../../../src/models/league/League';

// Helper function to create and validate a league

export async function createLeague({
  account,
  leagueName,
  seasonId,
}: {
  account: Account;
  leagueName: string;
  seasonId: number;
}): Promise<CreateLeagueResponse> {
  return request(app)
    .post(`/api/league/${account.profileId}/${seasonId}`)
    .send({ name: leagueName })
    .then((response) => response.body);
}

export async function validateLeagueFromCreation(
  league: League,
  {
    leagueName,
    seasonId,
    account,
  }: { leagueName: string; seasonId: number; account: Account }
) {
  expectUUID(league.id);
  expect(league.name).toEqual(leagueName);
  expect(league.seasonId).toEqual(seasonId);
  expect(league.leagueMembers).toBeDefined();
  expect(Array.isArray(league.leagueMembers)).toBe(true);

  // Validate league in DB
  const leagueFromDb = (await models.League.findOne({
    where: { leagueId: league.id },
  })) as LeagueAttributes;

  expect(leagueFromDb).not.toBeNull();
  expect(leagueFromDb.leagueId).toEqual(league.id);
  expect(leagueFromDb.name).toEqual(league.name);
  expect(leagueFromDb.seasonId).toEqual(league.seasonId);

  // Validate league members
  const leagueMembers: LeagueMember[] = league.leagueMembers;
  expect(leagueMembers.length).toBe(1);

  const leagueOwner: LeagueMember = leagueMembers[0];
  expect(leagueOwner.profile).toEqual(account);
  expect(leagueOwner.role).toEqual(LeagueMemberRole.Owner);
  expectUUID(leagueOwner.leagueProfileId);
  expect(leagueOwner.hasJoined).toBe(true);
  expect(typeof leagueOwner.totalPoints).toBe('number');
  expect(leagueOwner.totalPoints).toBeGreaterThanOrEqual(0);

  // Validate league member in DB
  const leagueMemberFromDb = (await models.LeagueProfile.findOne({
    where: {
      leagueId: league.id,
      profileId: account.profileId,
    },
  })) as LeagueProfileAttributes;

  expect(leagueMemberFromDb).not.toBeNull();
  expect(leagueMemberFromDb.id).toEqual(leagueOwner.leagueProfileId);
  expect(leagueMemberFromDb.profileId).toEqual(account.profileId);
  expect(leagueMemberFromDb.role).toEqual(LeagueMemberRole.Owner);
  expect(leagueMemberFromDb.leagueId).toEqual(league.id);

  return league;
}

export async function createAndValidateLeague({
  account,
  leagueName,
  seasonId,
}: {
  account: Account;
  leagueName: string;
  seasonId: number;
}) {
  const createLeagueResponse: CreateLeagueResponse = await createLeague({
    account,
    leagueName,
    seasonId,
  });

  validateSuccessApiResponse(createLeagueResponse);

  expect(createLeagueResponse.statusCode).toBe(201);
  expect(createLeagueResponse.message).toBe('League created successfully');
  expect(createLeagueResponse.responseData.league).toBeDefined();

  const league: League = createLeagueResponse.responseData.league;

  validateLeagueFromCreation(league, {
    leagueName,
    seasonId,
    account,
  });

  return league;
}

describe('POST /api/league/:profileId/:seasonId', () => {
  let account: Account;
  let account2: Account;
  beforeAll(async () => {
    const account1SignupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'jonSmith@testing.com',
        password: 'StrongPassword123!',
        userName: 'jonSmith',
        firstName: 'Jon',
        lastName: 'Smith',
      });
    validateSuccessApiResponse(account1SignupResponse.body);
    account = account1SignupResponse.body.responseData.account;

    const account2SignupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'maryChapperone@testing.com',
        password: 'AnotherStrongPassword456!',
        userName: 'maryChapperone',
        firstName: 'Mary',
        lastName: 'Chapperone',
      });
    validateSuccessApiResponse(account2SignupResponse.body);
    account2 = account2SignupResponse.body.responseData.account;
  });

  describe('Should create a league successfully', () => {
    it('should create and validate the first league', async () => {
      await createAndValidateLeague({
        account,
        leagueName: 'Test League for testing create league',
        seasonId: 48,
      });
    });

    it('should create and validate a second league for the same account', async () => {
      await createAndValidateLeague({
        account,
        leagueName: 'Second Test League',
        seasonId: 48,
      });
    });

    it('should create and validate a league for a different account', async () => {
      await createAndValidateLeague({
        account: account2,
        leagueName: 'Marys Test League',
        seasonId: 48,
      });
    });
  });

  describe('Should not create a league', () => {
    describe('Invalid profileId', () => {
      it('should not create a league with a non-UUID profileId', async () => {
        const createLeagueResponse: CreateLeagueResponse = await request(app)
          .post(`/api/league/not-a-uuid/48`)
          .send({ name: 'Non UUID Profile League' })
          .then((response) => response.body);

        expect(createLeagueResponse.success).toBe(false);
        expect(createLeagueResponse.statusCode).toBe(400);
      });

      it('should not create a league with a profileId that does not exist in the database', async () => {
        const fakeProfileId = '11111111-1111-1111-1111-111111111111';
        const createLeagueResponse: CreateLeagueResponse = await request(app)
          .post(`/api/league/${fakeProfileId}/48`)
          .send({ name: 'Fake Profile League' })
          .then((response) => response.body);

        expect(createLeagueResponse.success).toBe(false);
        expect(createLeagueResponse.statusCode).toBe(404);
      });
    });

    describe('Invalid seasonId', () => {
      it('should not create a league with a non-numeric seasonId', async () => {
        const createLeagueResponse: CreateLeagueResponse = await request(app)
          .post(`/api/league/${account.profileId}/not-a-number`)
          .send({ name: 'Non Numeric Season League' })
          .then((response) => response.body);

        expect(createLeagueResponse.success).toBe(false);
        expect(createLeagueResponse.statusCode).toBe(400);
      });

      it('should not create a league with a negative seasonId', async () => {
        const createLeagueResponse: CreateLeagueResponse = await request(app)
          .post(`/api/league/${account.profileId}/-1`)
          .send({ name: 'Negative Season League' })
          .then((response) => response.body);

        expect(createLeagueResponse.success).toBe(false);
        expect(createLeagueResponse.statusCode).toBe(400);
      });

      it('should not create a league with a seasonId that does not exist in the database', async () => {
        const invalidSeasonId = 999; // Assuming this season does not exist
        const createLeagueResponse: CreateLeagueResponse = await createLeague({
          account,
          leagueName: 'Invalid Season League',
          seasonId: invalidSeasonId,
        });

        expect(createLeagueResponse.success).toBe(false);
        expect(createLeagueResponse.statusCode).toBe(404);
      });
    });

    describe('Invalid name', () => {
      it('should not create a league with missing name', async () => {
        const createLeagueResponse: CreateLeagueResponse = await request(app)
          .post(`/api/league/${account.profileId}/48`)
          .send({})
          .then((response) => response.body);

        expect(createLeagueResponse.success).toBe(false);
        expect(createLeagueResponse.statusCode).toBe(400);
      });

      it('should not create a league with a name that is not alphanumeric', async () => {
        const createLeagueResponse: CreateLeagueResponse = await createLeague({
          account,
          leagueName: '!!!@@@###',
          seasonId: 48,
        });

        expect(createLeagueResponse.success).toBe(false);
        expect(createLeagueResponse.statusCode).toBe(400);
      });

      it('should not create a league with an empty name', async () => {
        const createLeagueResponse: CreateLeagueResponse = await createLeague({
          account,
          leagueName: '',
          seasonId: 48,
        });

        expect(createLeagueResponse.success).toBe(false);
        expect(createLeagueResponse.statusCode).toBe(400);
      });

      it('should not create a league with less than 5 characters in name', async () => {
        const createLeagueResponse: CreateLeagueResponse = await createLeague({
          account,
          leagueName: 'Abc',
          seasonId: 48,
        });

        expect(createLeagueResponse.success).toBe(false);
        expect(createLeagueResponse.statusCode).toBe(400);
      });

      it('should not create a league with more than 50 characters in name', async () => {
        const longName = 'A'.repeat(51);
        const createLeagueResponse: CreateLeagueResponse = await createLeague({
          account,
          leagueName: longName,
          seasonId: 48,
        });

        expect(createLeagueResponse.success).toBe(false);
        expect(createLeagueResponse.statusCode).toBe(400);
      });
    });
  });
});
