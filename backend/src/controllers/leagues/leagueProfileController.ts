import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";
import errorFactory from "../../utils/errors/errorFactory";
import { ProfileSearchParams, ProfileSearchResultsWithPagination } from "../../types/profile/profileTypes";
import profileService from "../../servicesAndHelpers/profile/profileService";
import { validate } from "uuid";
import leagueService from "../../servicesAndHelpers/leagues/leagueService";
import { LeagueInviteRequest, RespondLeagueInvite } from "../../types/league/leagueTypes";
import userService from "../../servicesAndHelpers/user/userService";
import { APIResponse, APIResponseError } from "../../types/api/apiResponseTypes";
import { InviteStatusEnum } from "../../models/LeagueProfile";
import { RespondToLeagueInviteRequest, RespondToLeagueInviteResponse } from "../../types/league/leagueDto";


const leagueProfileController = {
    getProfilesBySearch: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        logger.debug("In profileController.getProfilesBySearch");
        const userName = req.query.userName as string | undefined;
        const firstName = req.query.firstName as string | undefined;
        const lastName = req.query.lastName as string | undefined;
        const leagueId = req.query.leagueId as string | undefined;
        const page = req.query.page as string | undefined;
        const limit = req.query.limit as string | undefined;
        const sortBy = req.query.sortBy || 'UPDATED_AT' as string | undefined;
        const isAsc = req.query.isAsc || 'true' as string | undefined;

        try {

            if (!leagueId) {
                throw errorFactory({ statusCode: 400, error: "Missing League ID in request params" });
            }

            const pageNumber = parseInt(page as string, 10) || 1;
            const limitNumber = parseInt(limit as string, 10) || 10;

            const searchParams: ProfileSearchParams = {
                userName: userName as string,
                firstName: firstName as string,
                lastName: lastName as string,
                leagueId: leagueId as string,
                page: pageNumber as number,
                limit: limitNumber as number,
                sortBy: sortBy as string,
                isAsc: isAsc as string
            };

            const profileSearchResultsWithPagination: ProfileSearchResultsWithPagination =
                await profileService.searchForProfilesToInviteToLeague(searchParams);

            const message: string = profileSearchResultsWithPagination.pagination.totalCount === 0 ? 'No matching profiles found' : 'Found matching profiles';
            const foundResults: boolean = profileSearchResultsWithPagination.pagination.totalCount > 0
            res.status(200).json({ results: foundResults ? profileSearchResultsWithPagination : undefined, message, foundResults });

        } catch (error) {
            next(error);
        }
    },

    inviteProfileToLeague: async (req: Request, res: Response, next: NextFunction) => {
        const profileId = req.query.profileId as string | undefined;
        const requestBody = req.body;
        try {
            validateInviteProfileToLeagueRequest(profileId, requestBody);

            const leagueInviteRequest: LeagueInviteRequest = {
                leagueId: requestBody.leagueId,
                inviteeProfileId: requestBody.inviteeProfileId,
                inviterProfileId: requestBody.inviterProfileId,
                inviteMessage: requestBody.inviteMessage
            }

            const leagueInviteResponse: APIResponse = await leagueService.inviteProfileToLeague({
                leagueId: requestBody.leagueId,
                inviteeProfileId: requestBody.inviteeProfileId,
                inviterProfileId: requestBody.inviterProfileId,
                inviteMessage: requestBody.inviteMessage
            })

            res.status(leagueInviteResponse.statusCode).json(leagueInviteResponse);

        } catch (error) {
            next(error);
        }
    },

    getLeagueInvitesForProfile: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const profileId = req.query.profileId as string | undefined;
        try {
            if (!profileId || !validate(profileId)) {
                throw errorFactory({ statusCode: 400, error: "Bad Request" });
            }

            const user = await userService.getUserIdByProfileId(profileId);
            if (!user) {
                res.status(404).json({ message: "Profile not found" });
                return;
            }

            const leagueInvites = await leagueService.getLeagueInvitesForProfile(profileId);

            res.status(200).json(leagueInvites);

        } catch (error) {
            next(error);
        }
    },

    respondToLeagueInvite: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const profileId = req.query.profileId as string
        const requestBody = req.body;
        const inviteResponse = requestBody.inviteResponse;
        const leagueId = requestBody.leagueId;

        try {
            validateRespondToLeagueInviteRequest(profileId, requestBody);

            const leagueInviteResponse = await leagueService.respondToLeagueInvite({
                leagueId: requestBody.leagueId,
                inviteResponse: requestBody.inviteResponse
            }, profileId);

            res.status(leagueInviteResponse.statusCode).json(leagueInviteResponse);

        } catch (error) {
            next(error);
        }
    }
}

function validateInviteProfileToLeagueRequest(profileId: string | undefined, requestBody: any) {
    if (!requestBody.leagueId || !requestBody.inviterProfileId || !requestBody.inviteeProfileId) {
        logger.debug("League Invite Request: Request Body is missing leagueId, inviterProfileId, or inviteeProfileId");
        throw errorFactory({ statusCode: 400, error: "Bad Request" });
    }

    if (!profileId || profileId !== requestBody.inviterProfileId) {
        logger.debug("Missing Profile ID in request params or inviterProfileId does not match profileId in request params");
        throw errorFactory({ statusCode: 401, error: "Unauthorized" });
    }

    if (!requestBody.inviteMessage) {
        requestBody.inviteMessage = '';
    }
}

function validateRespondToLeagueInviteRequest(profileId: string | undefined, requestBody: RespondToLeagueInviteRequest) {
    if (!requestBody.leagueId || !requestBody.inviteResponse) {
        logger.debug("League Invite Response: Request Body is missing leagueId or inviteResponse");
        throw errorFactory({ statusCode: 400, error: "Bad Request" });
    }

    if (requestBody.inviteResponse !== RespondLeagueInvite.Accept && requestBody.inviteResponse !== RespondLeagueInvite.Decline) {
        logger.debug("League Invite Response: Request Body has invalid inviteResponse");
        throw errorFactory({ statusCode: 400, error: "Bad Request" });
    }

    if (!profileId) {
        logger.debug("Missing Profile ID in request params");
        throw errorFactory({ statusCode: 400, error: "Bad Request" });
    }
}

export default leagueProfileController;