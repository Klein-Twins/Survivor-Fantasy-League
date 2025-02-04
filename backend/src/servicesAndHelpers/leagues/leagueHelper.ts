import logger from '../../config/logger';
import { LeagueAttributes } from '../../models/league/League';
import leagueRepository from '../../repositories/leagueRepository';
import { LeagueInviteRequest } from '../../types/league/leagueTypes';
import { validateProfile } from '../profile/profileHelper';
import userService from '../user/userService';

export const validateLeague = async (leagueId: string): Promise<LeagueAttributes> => {
  const leagueAttributes = await leagueRepository.findLeagueByLeagueId(leagueId);
  if (!leagueAttributes) {
    logger.debug(`League with league id ${leagueId} not found`);
    throw {
      statusCode: 404,
      message: `League with league id ${leagueId} not found`,
      error: 'Not Found',
    };
  }
  return leagueAttributes;
};

export const validateInviterProfile = async (inviterProfileId: string): Promise<void> => {
  const inviterUserId = await validateProfile(inviterProfileId);
  if (!inviterUserId) {
    logger.debug(`Inviter Profile with profile id ${inviterProfileId} not found`);
    throw {
      statusCode: 404,
      message: `Inviter Profile with profile id ${inviterProfileId} not found`,
      error: 'Not Found',
    };
  }
};

export const validateInviterInLeague = async (inviterProfileId: string, leagueId: string): Promise<void> => {
  const isProfileInLeague = await leagueRepository.isProfileInLeague(inviterProfileId, leagueId);
  if (!isProfileInLeague) {
    logger.debug(`Inviter Profile with profile id ${inviterProfileId} is not in league with league id ${leagueId}`);
    throw {
      statusCode: 401,
      message: `Inviter Profile with profile id ${inviterProfileId} is not in league with league id ${leagueId}`,
      error: 'Unauthorized',
    };
  }
};

export const validateInviteeProfile = async (inviteeProfileId: string): Promise<void> => {
  const inviteeUserId = await validateProfile(inviteeProfileId);
  if (!inviteeUserId) {
    logger.debug(`Invited Profile with profile id ${inviteeProfileId} not found`);
    throw {
      statusCode: 404,
      message: `Invited Profile with profile id ${inviteeProfileId} not found`,
      error: 'Not Found',
    };
  }
};

export const checkInviteeConflict = async (leagueInviteRequest: LeagueInviteRequest): Promise<void> => {
  let conflictMessage: string | undefined = undefined;
  const inviteeProfileInLeague: boolean = await leagueRepository.isProfileInLeague(
    leagueInviteRequest.inviteeProfileId,
    leagueInviteRequest.leagueId
  );
  if (inviteeProfileInLeague) {
    conflictMessage = `Invited Profile with profile id ${leagueInviteRequest.inviteeProfileId} is already in league with league id ${leagueInviteRequest.leagueId}`;
  }
  const inviteeProfileAlreadyInvited: boolean = await leagueRepository.isProfileInInvited(
    leagueInviteRequest.inviteeProfileId,
    leagueInviteRequest.leagueId
  );
  if (inviteeProfileAlreadyInvited) {
    conflictMessage = `Invited Profile with profile id ${leagueInviteRequest.inviteeProfileId} is already invited to league with league id ${leagueInviteRequest.leagueId}`;
  }
  if (conflictMessage) {
    throw {
      statusCode: 409,
      message: conflictMessage,
      error: 'Conflict',
    };
  }
};
