import { LeagueAttributes } from '../../../models/league/League';
import {
  InviteStatus,
  LeagueProfileAttributes,
} from '../../../models/league/LeagueProfile';
import { v4 as uuidv4 } from 'uuid';
import { testLeagueProfileIds } from '../devIds';
import { LeagueMemberRole } from '../../../generated-api';
import testLeagueSurveyData, {
  EpisodeToLeagueMemberSurveysMap,
  LeagueMemberSurveys,
} from './survey/testLeagueSurveys';
import { UUID } from 'crypto';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { testProfileIds } from '../data/account/testAccountData';

export type League = LeagueAttributes & {
  leagueMembers: LeagueMember[];
  episodeSurveyData: EpisodeToLeagueMemberSurveysMap;
};

export const season48TestLeague1Id = '9dd3c2a0-da9c-4330-8a77-ad57d91015db';

type LeagueMember = Omit<LeagueProfileAttributes, 'leagueId'>;

export const season48TestLeague1: League = {
  leagueId: season48TestLeague1Id,
  seasonId: 48,
  name: 'Test League 1',
  createdAt: new Date('2025-01-15T16:16:28.942-06:00'),
  leagueMembers: [
    {
      id: testLeagueProfileIds.League1TonyStart,
      profileId: testProfileIds.TonyStark,
      role: LeagueMemberRole.Owner,
      inviteStatus: InviteStatus.Accepted,
      inviterProfileId: null,
    },
    {
      id: testLeagueProfileIds.League1CaptainAmerica,
      profileId: testProfileIds.CaptainAmerica,
      role: LeagueMemberRole.Member,
      inviteStatus: InviteStatus.Accepted,
      inviterProfileId: testProfileIds.TonyStark,
    },
    {
      id: testLeagueProfileIds.League1BruceBanner,
      profileId: testProfileIds.BruceBanner,
      role: LeagueMemberRole.Owner,
      inviteStatus: InviteStatus.Accepted,
      inviterProfileId: testProfileIds.TonyStark,
    },
  ],
  episodeSurveyData:
    testLeagueSurveyData.get(season48TestLeague1Id as UUID) ||
    new Map<EpisodeAttributes['id'], LeagueMemberSurveys>(),
};

const season48TestLeagues: Record<'testLeague1', League> = {
  testLeague1: season48TestLeague1,
};
export default season48TestLeagues;
