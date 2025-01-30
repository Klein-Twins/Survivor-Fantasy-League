import { sequelize } from '../../config/db';
import {
  ApiError,
  CreateAndSendLeagueInviteRequestBody,
  League,
  LeagueMember,
  LeagueMemberRoleEnum,
  RespondToLeagueInviteRequestBody,
  RespondToLeagueInviteRequestBodyInviteResponseEnum,
} from '../../generated-api';
import { InviteStatusEnum, LeagueProfileAttributes } from '../../models/LeagueProfile';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';
import leagueRepository from '../../repositories/leagueRepository';
import userService from '../user/userService';

const leagueMemberService = {
  inviteProfileToLeague,
  respondToLeagueInvite,
  isProfileInLeague,
  getLeagueProfileByProfileId,
};

async function inviteProfileToLeague({
  inviterProfileId,
  invitedProfileId,
  leagueId,
}: CreateAndSendLeagueInviteRequestBody): Promise<void> {
  const transaction = await sequelize.transaction();
  try {
    const leagueMember: LeagueMember | null = await leagueMemberRepository.createLeagueMember(
      leagueId,
      invitedProfileId,
      inviterProfileId,
      LeagueMemberRoleEnum.MEMBER,
      InviteStatusEnum.Pending,
      { transaction }
    );
    if (!leagueMember) {
      const error: ApiError = {
        error: 'Internal Server Error',
        statusCode: 500,
        message: `Failed to create league member for profile ${invitedProfileId} in league ${leagueId}`,
        success: false,
      };
      throw error;
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function respondToLeagueInvite({
  leagueId,
  profileId,
  inviteResponse,
}: RespondToLeagueInviteRequestBody): Promise<League | null> {
  const transaction = await sequelize.transaction();
  try {
    const league = await leagueMemberRepository.respondToLeagueInvite(leagueId, profileId, inviteResponse, {
      transaction,
    });
    await transaction.commit();
    return league;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function getLeagueProfileByProfileId(
  leagueId: string,
  profileId: string
): Promise<LeagueProfileAttributes | null> {
  const leagueProfileAttributes: LeagueProfileAttributes | null =
    await leagueMemberRepository.getLeagueProfileByProfileId(leagueId, profileId);
  return leagueProfileAttributes;
}

async function isProfileInLeague(leagueId: string, profileId: string): Promise<boolean> {
  const leagueProfileAttributes: LeagueProfileAttributes | null = await getLeagueProfileByProfileId(
    leagueId,
    profileId
  );
  return !!leagueProfileAttributes;
}

export default leagueMemberService;
