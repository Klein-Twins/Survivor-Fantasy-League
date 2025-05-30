import { UUID } from 'crypto';
import { LeagueAttributes } from '../../../../../../models/league/League';
import { testLeagueIdsSeason48, testLeagueProfileIds } from './ids';
import { testAccountIds } from '../../../account/ids';
import { InviteResponse } from '../../../../../../generated-api';
import { ProfileAttributes } from '../../../../../../models/account/Profile';

export type SeedLeagues = SeedLeague[];

export type SeedLeague = LeagueAttributes & {
  owner: SeedLeagueOwner;
  invites: SeedLeagueInviteAndResponse[];
};

export type SeedLeagueOwner = Omit<
  SeedEnrolledLeagueMember,
  'inviterProfileId' | 'inviteResponse'
>;
export type SeedEnrolledLeagueMember = {
  profileId: UUID;
  leagueProfileId: UUID;
  inviterProfileId: UUID;
  inviteResponse: InviteResponse;
};

export type SeedLeagueInviteAndResponse = {
  invitedProfileId: ProfileAttributes['profileId'];
  leagueProfileId: ProfileAttributes['profileId'];
  inviterProfileId: ProfileAttributes['profileId'];
  inviteResponse: InviteResponse;
};

export const leagueDataSeason48: SeedLeagues = [
  {
    leagueId: testLeagueIdsSeason48.league1,
    name: 'Test League 1',
    seasonId: 48,
    owner: {
      profileId: testAccountIds.TonyStark.profileId,
      leagueProfileId: testLeagueProfileIds.League1TonyStart,
    },
    invites: [
      {
        invitedProfileId: testAccountIds.CaptainAmerica.profileId,
        leagueProfileId: testLeagueProfileIds.League1CaptainAmerica,
        inviterProfileId: testAccountIds.TonyStark.profileId,
        inviteResponse: InviteResponse.Accept,
      },
      {
        invitedProfileId: testAccountIds.BruceBanner.profileId,
        leagueProfileId: testLeagueProfileIds.League1BruceBanner,
        inviterProfileId: testAccountIds.TonyStark.profileId,
        inviteResponse: InviteResponse.Accept,
      },
      {
        invitedProfileId: testAccountIds.ThorOdinson.profileId,
        leagueProfileId: testLeagueProfileIds.League1ThorOdinson,
        inviterProfileId: testAccountIds.TonyStark.profileId,
        inviteResponse: InviteResponse.Decline,
      },
    ],
  },
  {
    leagueId: testLeagueIdsSeason48.league2,
    name: 'Test League 2',
    seasonId: 48,
    owner: {
      profileId: testAccountIds.NatashaRomanoff.profileId,
      leagueProfileId: testLeagueProfileIds.League2NatashaRomanoff,
    },
    invites: [
      {
        invitedProfileId: testAccountIds.ClintBarton.profileId,
        leagueProfileId: testLeagueProfileIds.League2ClintBarton,
        inviterProfileId: testAccountIds.NatashaRomanoff.profileId,
        inviteResponse: InviteResponse.Accept,
      },
      {
        invitedProfileId: testAccountIds.ThorOdinson.profileId,
        leagueProfileId: testLeagueProfileIds.League2ThorOdinson,
        inviterProfileId: testAccountIds.NatashaRomanoff.profileId,
        inviteResponse: InviteResponse.Accept,
      },
    ],
  },

  {
    leagueId: testLeagueIdsSeason48.league3,
    name: 'Test League 3',
    seasonId: 48,
    owner: {
      profileId: testAccountIds.VisionStone.profileId,
      leagueProfileId: testLeagueProfileIds.League3VisionStone,
    },
    invites: [
      {
        invitedProfileId: testAccountIds.SamWilson.profileId,
        leagueProfileId: testLeagueProfileIds.League3SamWilson,
        inviterProfileId: testAccountIds.VisionStone.profileId,
        inviteResponse: InviteResponse.Accept,
      },
      {
        invitedProfileId: testAccountIds.WandaMaximoff.profileId,
        leagueProfileId: testLeagueProfileIds.League3WandaMaximoff,
        inviterProfileId: testAccountIds.VisionStone.profileId,
        inviteResponse: InviteResponse.Accept,
      },
    ],
  },

  {
    leagueId: testLeagueIdsSeason48.league4,
    name: 'Test League 4',
    seasonId: 48,
    owner: {
      profileId: testAccountIds.PeterParker.profileId,
      leagueProfileId: testLeagueProfileIds.League4PeterParker,
    },
    invites: [
      {
        invitedProfileId: testAccountIds.TChallaWakanda.profileId,
        leagueProfileId: testLeagueProfileIds.League4TChallaWakanda,
        inviterProfileId: testAccountIds.PeterParker.profileId,
        inviteResponse: InviteResponse.Accept,
      },
    ],
  },

  {
    leagueId: testLeagueIdsSeason48.league5,
    name: 'Test League 5',
    seasonId: 48,
    owner: {
      profileId: testAccountIds.StephenStrange.profileId,
      leagueProfileId: testLeagueProfileIds.League5StephenStrange,
    },
    invites: [
      {
        invitedProfileId: testAccountIds.TonyStark.profileId,
        leagueProfileId: testLeagueProfileIds.League5TonyStark,
        inviterProfileId: testAccountIds.StephenStrange.profileId,
        inviteResponse: InviteResponse.Accept,
      },
      {
        invitedProfileId: testAccountIds.BruceBanner.profileId,
        leagueProfileId: testLeagueProfileIds.League5BruceBanner,
        inviterProfileId: testAccountIds.StephenStrange.profileId,
        inviteResponse: InviteResponse.Accept,
      },
    ],
  },
];
