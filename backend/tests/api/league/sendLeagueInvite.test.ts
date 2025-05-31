import request from 'supertest';
import app from '../../../app';
import { Account, InviteResponse, League } from '../../../src/generated-api';
import { validateSuccessApiResponse } from '../auth/testHelper';
import { models } from '../../../src/config/db';
import {
  InviteStatus,
  LeagueInviteAttributes,
} from '../../../src/models/league/LeagueInvites';
import { expectUUID } from '../../utils/uuidValidator';
import { LeagueProfileAttributes } from '../../../src/models/league/LeagueProfile';
import { container } from 'tsyringe';
import { LeagueService } from '../../../src/services/league/LeagueService';
import { UUID } from 'crypto';
import { LeagueInvite } from '../../../src/domain/league/invite/LeagueInvite';

//Required inputs:
/**
 * path:
 * profileId: string;
 * seasonId: string;
 *
 * body: {
 *  inviterProfileId: string;
 *  invitedProfileId: string;
 *  leagueId: string;
 * }
 */

describe('POST /api/league/invite/{profileId}/{seasonId}', () => {
  describe('Should create a league invite successfully', () => {
    let account1: Account;
    let account2: Account;
    let league: League;

    beforeAll(async () => {
      const account1SignupResponse = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'account1@testing.com',
          password: 'StrongPassword123!',
          userName: 'account1',
          firstName: 'Account',
          lastName: 'One',
        });
      validateSuccessApiResponse(account1SignupResponse.body);
      account1 = account1SignupResponse.body.responseData.account;

      const account2SignupResponse = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'account2@testing.com',
          password: 'StrongPassword123!',
          userName: 'account2',
          firstName: 'Account',
          lastName: 'Two',
        });
      validateSuccessApiResponse(account2SignupResponse.body);
      account2 = account2SignupResponse.body.responseData.account;

      //Create a league for account 1
      const createLeagueResponse = await request(app)
        .post(`/api/league/${account1.profileId}/${48}`)
        .send({
          name: 'Test League for testing invites',
        });
      validateSuccessApiResponse(createLeagueResponse.body);
      league = createLeagueResponse.body.responseData.league;

      //Send an invite from account 1 to account 2
      const sendInviteResponse = await request(app)
        .post(`/api/league/invite/${account2.profileId}/${48}`)
        .send({
          inviterProfileId: account1.profileId,
          invitedProfileId: account2.profileId,
          leagueId: league.id,
        });
      validateSuccessApiResponse(sendInviteResponse.body);
    }, 20000);

    it('should create the correct record in the LeagueInvites table of the database', async () => {
      const leagueInviteAttributes: LeagueInviteAttributes | null =
        (await models.LeagueInvites.findOne({
          where: {
            invitedProfileId: account2.profileId,
            leagueId: league.id,
          },
        })) as LeagueInviteAttributes;

      expect(leagueInviteAttributes).not.toBeNull();
      expectUUID(leagueInviteAttributes.id);
      expect(leagueInviteAttributes.invitedProfileId).toBe(account2.profileId);
      expect(leagueInviteAttributes.inviterProfileId).toBe(account1.profileId);
      expect(leagueInviteAttributes.status).toBe(InviteStatus.Pending);
      expect(leagueInviteAttributes.leagueId).toBe(league.id);
    });
    it('should not have a record in the leagueProfiles table for the invited profile', async () => {
      const leagueProfileAttributes: LeagueProfileAttributes | null =
        await models.LeagueProfile.findOne({
          where: {
            profileId: account2.profileId,
            leagueId: league.id,
          },
        });
      expect(leagueProfileAttributes).toBeNull();
    });
    it('should have the correct league invite domain object in the league object', async () => {
      const leagueDomainObj = await container
        .resolve(LeagueService)
        .fetchLeague(league.id as UUID);

      const leagueInvites = leagueDomainObj.getLeagueInvites();
      expect(leagueInvites.size).toBe(1);
      const leagueInvite = leagueInvites.get(
        account2.profileId as UUID
      ) as LeagueInvite;

      expect(leagueInvite).toBeDefined();
      expect(leagueInvite.getInvitedAccount().toDTO()).toEqual(account2);
      expect(leagueInvite.getInviters().length).toBe(1);
      expect(
        leagueInvite.getInviters()[0].inviterLeagueMember.getAccount().toDTO()
      ).toEqual(account1);
    });
    it('should not have the invited profile in the league member in the league object', async () => {
      const leagueDomainObj = await container
        .resolve(LeagueService)
        .fetchLeague(league.id as UUID);

      const leagueMembers = leagueDomainObj.getLeagueMembers();
      expect(leagueMembers.length).toBe(1); // Only the owner should be present
      expect(leagueMembers[0].getAccount().toDTO()).toEqual(account1);
      expect(
        leagueDomainObj
          .getLeagueMembers()
          .find(
            (member) => member.getAccount().getAccountId() === account2.userId
          )
      ).toBeUndefined();
    });

    describe('Inviting another profile to the same league', () => {
      let account3: Account;
      let leagueInvite: LeagueInvite;

      beforeAll(async () => {
        const account3SignupResponse = await request(app)
          .post('/api/auth/signup')
          .send({
            email: 'thisisatestingemail@mail.com',
            password: 'StrongPassword123!',
            userName: 'account3',
            firstName: 'Account',
            lastName: 'Three',
          });
        validateSuccessApiResponse(account3SignupResponse.body);
        account3 = account3SignupResponse.body.responseData.account;
        //Send an invite from account 1 to account 3
        const sendInviteResponse = await request(app)
          .post(`/api/league/invite/${account3.profileId}/${48}`)
          .send({
            inviterProfileId: account1.profileId,
            invitedProfileId: account3.profileId,
            leagueId: league.id,
          });
        validateSuccessApiResponse(sendInviteResponse.body);
      }, 20000);

      it('should create a second invite for the new profile in the LeagueInvites table', async () => {
        const leagueInviteAttributes: LeagueInviteAttributes | null =
          (await models.LeagueInvites.findOne({
            where: {
              invitedProfileId: account3.profileId,
              leagueId: league.id,
            },
          })) as LeagueInviteAttributes;

        expect(leagueInviteAttributes).not.toBeNull();
        expectUUID(leagueInviteAttributes.id);
        expect(leagueInviteAttributes.invitedProfileId).toBe(
          account3.profileId
        );
        expect(leagueInviteAttributes.inviterProfileId).toBe(
          account1.profileId
        );
        expect(leagueInviteAttributes.status).toBe(InviteStatus.Pending);
        expect(leagueInviteAttributes.leagueId).toBe(league.id);
      });
      it('should not have a record in the leagueProfiles table for the invited profile', async () => {
        const leagueProfileAttributes: LeagueProfileAttributes | null =
          await models.LeagueProfile.findOne({
            where: {
              profileId: account3.profileId,
              leagueId: league.id,
            },
          });
        expect(leagueProfileAttributes).toBeNull();
      });
      it('should have the correct league invite domain object in the league object for the new invite', async () => {
        const leagueDomainObj = await container
          .resolve(LeagueService)
          .fetchLeague(league.id as UUID);

        const leagueInvites = leagueDomainObj.getLeagueInvites();
        expect(leagueInvites.size).toBe(2);
        const leagueInvite = leagueInvites.get(
          account3.profileId as UUID
        ) as LeagueInvite;

        expect(leagueInvite).toBeDefined();
        expect(leagueInvite.getInvitedAccount().toDTO()).toEqual(account3);
        expect(leagueInvite.getInviters().length).toBe(1);
        expect(
          leagueInvite.getInviters()[0].inviterLeagueMember.getAccount().toDTO()
        ).toEqual(account1);
      });
      it('should not have the invited profile in the league member in the league object', async () => {
        const leagueDomainObj = await container
          .resolve(LeagueService)
          .fetchLeague(league.id as UUID);

        const leagueMembers = leagueDomainObj.getLeagueMembers();
        expect(leagueMembers.length).toBe(1); // Only the owner should be present
        expect(leagueMembers[0].getAccount().toDTO()).toEqual(account1);
        expect(
          leagueDomainObj
            .getLeagueMembers()
            .find(
              (member) => member.getAccount().getAccountId() === account3.userId
            )
        ).toBeUndefined();
      });

      describe('Two League members inviting the same profile', () => {
        beforeAll(async () => {
          const acceptLeagueInviteResponse = await request(app)
            .put(`/api/league/invite/${account3.profileId}/${48}`)
            .send({
              leagueId: league.id,
              invitedProfileId: account3.profileId,
              inviteResponse: InviteResponse.Accept,
            });
          validateSuccessApiResponse(acceptLeagueInviteResponse.body);
        });
        it('testing', () => {});
      });
    });
  });
});
