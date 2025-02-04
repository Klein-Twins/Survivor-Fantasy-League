import { sequelize } from '../../config/db';
import {
  CreateAndSendLeagueInviteRequestBody,
  League,
  LeagueMember,
  LeagueMemberRoleEnum,
  RespondToLeagueInviteRequestBody,
} from '../../generated-api';
import { InviteStatusEnum, LeagueProfileAttributes } from '../../models/league/LeagueProfile';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';
import { ForbiddenError, InternalServerError } from '../../utils/errors/errors';

const leagueMemberService = {
  inviteProfileToLeague,
  respondToLeagueInvite,
  isProfileInLeague,
  getLeagueProfileByProfileId,
  validateProfileIsInLeague,
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
      throw new InternalServerError(
        `Failed to create league member for profile ${invitedProfileId} in league ${leagueId}`
      );
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

async function validateProfileIsInLeague(leagueId: string, profileId: string): Promise<void> {
  const isProfileInLeagueResult = await leagueMemberRepository.isUserInLeague(leagueId, profileId);
  if (!isProfileInLeagueResult) {
    throw new ForbiddenError(`Profile ${profileId} is not a member of league ${leagueId}`);
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
