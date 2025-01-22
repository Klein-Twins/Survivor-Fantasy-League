import { ApiError, CreateAndSendLeagueInviteRequestBody, RespondToLeagueInviteRequestBody, RespondToLeagueInviteRequestBodyInviteResponseEnum } from "../../generated-api";
import leagueMemberRepository from "../../repositories/league/leagueMemberRepository";
import leagueRepository from "../../repositories/leagueRepository";
import { isValidUUIDv4 } from "../../utils/uuid";
import userService from "../user/userService";

const leagueMemberHelper = {
    validateInviteMemberToLeagueRequest,
    validateGetLeagueInvitesForProfileIdRequest,
    validateRespondToLeagueInviteRequest
};

async function validateRespondToLeagueInviteRequest({ leagueId, profileId, inviteResponse }: RespondToLeagueInviteRequestBody): Promise<ApiError | null> {
    let error: ApiError | null;

    if (!leagueId || !profileId || !inviteResponse) {
        error = {
            error: "Bad Request",
            statusCode: 400,
            message: `Missing required fields: LeagueId, ProfileId, InviteResponse`,
            success: false
        }
        return error;
    }

    if (inviteResponse !== RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT && inviteResponse !== RespondToLeagueInviteRequestBodyInviteResponseEnum.DECLINE) {
        error = {
            error: "Bad Request",
            statusCode: 400,
            message: `InviteResponse must be either ${RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT} or ${RespondToLeagueInviteRequestBodyInviteResponseEnum.DECLINE}`,
            success: false
        }
        return error;
    }

    if (!isValidUUIDv4(leagueId)) {
        error = {
            error: "Bad Request",
            statusCode: 400,
            message: `Invalid league id: ${leagueId}`,
            success: false
        }
        return error;
    }

    if (!isValidUUIDv4(profileId)) {
        error = {
            error: "Bad Request",
            statusCode: 400,
            message: `Invalid profile id: ${profileId}`,
            success: false
        }
        return error;
    }

    if (!await userService.getUserIdByProfileId(profileId)) {
        error = {
            error: "Not Found",
            statusCode: 404,
            message: `Profile with id ${profileId} not found`,
            success: false
        }
        return error;
    }

    if (!await leagueRepository.getLeagueByLeagueId(leagueId)) {
        error = {
            error: "Not Found",
            statusCode: 404,
            message: `League with id ${leagueId} not found`,
            success: false
        }
        return error;
    }

    if (!await leagueMemberRepository.isUserInvitedToLeague(leagueId, profileId)) {
        error = {
            error: "Unauthorized",
            statusCode: 401,
            message: `Profile with id ${profileId} is not invited to league with id ${leagueId}`,
            success: false
        }
        return error;
    }

    return null;
}

async function validateGetLeagueInvitesForProfileIdRequest(profileId: string | undefined): Promise<ApiError | null> {
    let error: ApiError | null;
    if (!profileId) {
        error = {
            error: "Bad Request",
            statusCode: 400,
            message: `Missing required field: ProfileId`,
            success: false
        }
        return error;
    }

    if (!await userService.getUserIdByProfileId(profileId)) {
        error = {
            error: "Not Found",
            statusCode: 404,
            message: `Profile with id ${profileId} not found`,
            success: false
        }
        return error;
    }

    return null;
}

async function validateInviteMemberToLeagueRequest({ inviterProfileId, invitedProfileId, leagueId }: CreateAndSendLeagueInviteRequestBody): Promise<ApiError | null> {

    let error: ApiError | null;
    if (!invitedProfileId || !inviterProfileId || !leagueId) {
        error = {
            error: "Bad Request",
            statusCode: 400,
            message: `Missing required fields: InvitedProfileId, InviterProfileId, LeagueId`,
            success: false
        }
        return error;
    }

    if (!await userService.getUserIdByProfileId(invitedProfileId)) {
        error = {
            error: "Not Found",
            statusCode: 404,
            message: `Profile with id ${invitedProfileId} not found`,
            success: false
        }
        return error;
    }

    if (inviterProfileId === invitedProfileId) {
        error = {
            error: "Bad Request",
            statusCode: 400,
            message: `Inviter profile id and invited profile id cannot be the same`,
            success: false
        }
        return error;
    }

    if (!await userService.getUserIdByProfileId(inviterProfileId)) {
        error = {
            error: "Not Found",
            statusCode: 404,
            message: `Profile with id ${inviterProfileId} not found`,
            success: false
        }
        return error;
    }

    if (!await leagueRepository.getLeagueByLeagueId(leagueId)) {
        error = {
            error: "Not Found",
            statusCode: 404,
            message: `League with id ${leagueId} not found`,
            success: false
        }
        return error;
    }

    if (!await leagueMemberRepository.isUserInLeague(leagueId, inviterProfileId)) {
        error = {
            error: "Forbidden",
            statusCode: 403,
            message: `Inviter profile with id ${inviterProfileId} is not in league with id ${leagueId}`,
            success: false
        }
        return error;
    }

    if (await leagueMemberRepository.isUserInLeague(leagueId, invitedProfileId)) {
        error = {
            error: "Conflic",
            statusCode: 409,
            message: `Invited profile with id ${inviterProfileId} is already in league with id ${leagueId}`,
            success: false
        }
        return error;
    }

    if (await leagueMemberRepository.isUserInvitedToLeague(leagueId, invitedProfileId)) {
        error = {
            error: "Conflict",
            statusCode: 409,
            message: `Profile with id ${invitedProfileId} is already invited to league with id ${leagueId}`,
            success: false
        }
        return error;
    }

    return null;
}
export default leagueMemberHelper;