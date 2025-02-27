import { extensions } from 'sequelize/types/utils/validator-extras';
import { LeagueAttributes } from '../../models/league/League';
import { APIResponse } from '../api/apiResponseTypes';
import { Profile } from '../profile/profileTypes';

export type LeagueWithDetails = Omit<LeagueAttributes, 'SEASON_ID'>;

export interface LeagueInviteRequest {
  leagueId: string;
  inviteeProfileId: string;
  inviterProfileId: string;
  inviteMessage?: string;
}

export interface League {
  leagueId: string;
  name: string;
  season: number;
}

export interface GetProfilesBySearchResponseData extends APIResponse {
  leagueInvites: LeagueInvite[];
  numLeagueInvites: number;
}

export interface LeagueInvite {
  league: League;
  message: string;
  inviterProfile: Profile | null;
}

export enum RespondLeagueInvite {
  Accept = 'ACCEPT',
  Decline = 'DECLINE',
}
