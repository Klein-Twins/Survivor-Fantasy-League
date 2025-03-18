import { LeagueMemberRole } from '../../../generated-api';
import {
  InviteStatus,
  LeagueProfileAttributes,
} from '../../../models/league/LeagueProfile';
import { testLeagueIds, testLeagueProfileIds, testProfileIds } from '../devIds';

const testLeagueProfilesData: LeagueProfileAttributes[] = [
  // The Chicken Race League
  {
    id: testLeagueProfileIds.League1TonyStart,
    profileId: testProfileIds.TonyStark,
    leagueId: testLeagueIds.league1,
    role: LeagueMemberRole.Owner,
    inviteStatus: InviteStatus.Accepted,
    inviterProfileId: null,
  },
  {
    id: testLeagueProfileIds.League1BruceBanner,
    profileId: testProfileIds.BruceBanner,
    leagueId: testLeagueIds.league1,
    role: LeagueMemberRole.Member,
    inviteStatus: InviteStatus.Accepted,
    inviterProfileId: testProfileIds.TonyStark,
  },
  {
    id: testLeagueProfileIds.League1CaptainAmerica,
    profileId: testProfileIds.CaptainAmerica,
    leagueId: testLeagueIds.league1,
    role: LeagueMemberRole.Member,
    inviteStatus: InviteStatus.Pending,
    inviterProfileId: testProfileIds.TonyStark,
  },

  // Avengers Assemble League
  {
    id: testLeagueProfileIds.League2NatashaRomanoff,
    profileId: testProfileIds.NatashaRomanoff,
    leagueId: testLeagueIds.league2,
    role: LeagueMemberRole.Owner,
    inviteStatus: InviteStatus.Accepted,
    inviterProfileId: null,
  },
  {
    id: testLeagueProfileIds.League2ClintBarton,
    profileId: testProfileIds.ClintBarton,
    leagueId: testLeagueIds.league2,
    role: LeagueMemberRole.Member,
    inviteStatus: InviteStatus.Accepted,
    inviterProfileId: testProfileIds.NatashaRomanoff,
  },
  {
    id: testLeagueProfileIds.League2ThorOdinson,
    profileId: testProfileIds.ThorOdinson,
    leagueId: testLeagueIds.league2,
    role: LeagueMemberRole.Member,
    inviteStatus: InviteStatus.Pending,
    inviterProfileId: testProfileIds.NatashaRomanoff,
  },

  // Shield Agents League
  {
    id: testLeagueProfileIds.League3WandaMaximoff,
    profileId: testProfileIds.WandaMaximoff,
    leagueId: testLeagueIds.league3,
    role: LeagueMemberRole.Owner,
    inviteStatus: InviteStatus.Accepted,
    inviterProfileId: null,
  },
  {
    id: testLeagueProfileIds.League3VisionStone,
    profileId: testProfileIds.VisionStone,
    leagueId: testLeagueIds.league3,
    role: LeagueMemberRole.Member,
    inviteStatus: InviteStatus.Accepted,
    inviterProfileId: testProfileIds.WandaMaximoff,
  },
  {
    id: testLeagueProfileIds.League3SamWilson,
    profileId: testProfileIds.SamWilson,
    leagueId: testLeagueIds.league3,
    role: LeagueMemberRole.Member,
    inviteStatus: InviteStatus.Pending,
    inviterProfileId: testProfileIds.WandaMaximoff,
  },

  // Wakanda Forever League
  {
    id: testLeagueProfileIds.League4TChallaWakanda,
    profileId: testProfileIds.TChallaWakanda,
    leagueId: testLeagueIds.league4,
    role: LeagueMemberRole.Owner,
    inviteStatus: InviteStatus.Accepted,
    inviterProfileId: null,
  },
  {
    id: testLeagueProfileIds.League4PeterParker,
    profileId: testProfileIds.PeterParker,
    leagueId: testLeagueIds.league4,
    role: LeagueMemberRole.Member,
    inviteStatus: InviteStatus.Accepted,
    inviterProfileId: testProfileIds.TChallaWakanda,
  },

  // Guardians League
  {
    id: testLeagueProfileIds.League5StephenStrange,
    profileId: testProfileIds.StephenStrange,
    leagueId: testLeagueIds.league5,
    role: LeagueMemberRole.Owner,
    inviteStatus: InviteStatus.Accepted,
    inviterProfileId: null,
  },
  {
    id: testLeagueProfileIds.League5TonyStark,
    profileId: testProfileIds.TonyStark,
    leagueId: testLeagueIds.league5,
    role: LeagueMemberRole.Member,
    inviteStatus: InviteStatus.Accepted,
    inviterProfileId: testProfileIds.StephenStrange,
  },
  {
    id: testLeagueProfileIds.League5BruceBanner,
    profileId: testProfileIds.BruceBanner,
    leagueId: testLeagueIds.league5,
    role: LeagueMemberRole.Member,
    inviteStatus: InviteStatus.Pending,
    inviterProfileId: testProfileIds.StephenStrange,
  },
];

export default testLeagueProfilesData;
