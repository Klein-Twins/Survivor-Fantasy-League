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

describe('POST /api/league/:profileId/:seasonId', () => {
  let account: Account;
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
  });

  describe('Should create a league successfully', () => {
    let createLeagueResponse: CreateLeagueResponse;
    beforeAll(async () => {
      createLeagueResponse = await request(app)
        .post(`/api/league/${account.profileId}/${48}`)
        .send({
          name: 'Test League for testing create league',
        })
        .then((response) => response.body);
      validateSuccessApiResponse(createLeagueResponse);
    });

    it('should return 201 status code', async () => {
      expect(createLeagueResponse.statusCode).toBe(201);
    });

    it("should return a message 'League created successfully'", async () => {
      expect(createLeagueResponse.message).toBe('League created successfully');
    });

    it('should return the created league in responseData', async () => {
      expect(createLeagueResponse.responseData.league).toBeDefined();
    });

    describe('Validate the created league', () => {
      let league: League;

      beforeAll(() => {
        league = createLeagueResponse.responseData.league;
      });

      it('should have a valid league ID', () => {
        expectUUID(league.id);
      });

      it('should have the correct league name', () => {
        expect(league.name).toEqual('Test League for testing create league');
      });

      it('should have the correct season ID', () => {
        expect(league.seasonId).toEqual(48);
      });

      it('should have leagueMembers defined', () => {
        expect(league.leagueMembers).toBeDefined();
        expect(Array.isArray(league.leagueMembers)).toBe(true);
      });

      it('should have league match the database record in LGE_LEAGUES table', async () => {
        const leagueFromDb = (await models.League.findOne({
          where: { leagueId: league.id },
        })) as LeagueAttributes;

        expect(leagueFromDb).not.toBeNull();
        expect(leagueFromDb.leagueId).toEqual(league.id);
        expect(leagueFromDb.name).toEqual(league.name);
        expect(leagueFromDb.seasonId).toEqual(league.seasonId);
      });

      describe('Validate League Members of created league', () => {
        let leagueMembers: LeagueMember[];

        beforeAll(() => {
          leagueMembers = league.leagueMembers;
        });

        it('should have one league member', () => {
          expect(leagueMembers.length).toBe(1);
        });

        describe('Validate the league member', () => {
          let leagueOwner: LeagueMember;

          beforeAll(() => {
            leagueOwner = leagueMembers[0];
          });

          it('should have an equivalent profile to the account that created the league', () => {
            expect(leagueOwner.profile).toEqual(account);
          });

          it('should have the role of Owner', () => {
            expect(leagueOwner.role).toEqual(LeagueMemberRole.Owner);
          });

          it('should have a valid leagueProfileId', () => {
            expectUUID(leagueOwner.leagueProfileId);
          });

          it('should have hasJoined set to true', () => {
            expect(leagueOwner.hasJoined).toBe(true);
          });

          it('should have totalPoints be a number', () => {
            expect(typeof leagueOwner.totalPoints).toBe('number');
            expect(leagueOwner.totalPoints).toBeGreaterThanOrEqual(0);
          });

          it('should match the database record for the league member', async () => {
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
          });
        });
      });
    });
  });
});
