import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";
import { ApiError, SearchProfilesForLeagueInviteResponse, SortByEnum } from "../../generated-api";
import leagueService from "../../servicesAndHelpers/leagues/leagueService";
import profileService from "../../servicesAndHelpers/profile/profileService";
import leagueRepository from "../../repositories/leagueRepository";

const profileController = {
    getProfilesBySearch,
}

export default profileController;

export type ProfileSearchParams = {
    userName?: string;
    firstName?: string;
    lastName?: string;
    leagueId: string
    page: number;
    limit: number;
    sortBy: SortByEnum;
    isAsc: boolean;
}


async function getProfilesBySearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    let response: SearchProfilesForLeagueInviteResponse;
    try {
        const userName: string | undefined = req.query.userName as string | undefined;
        const firstName = req.query.firstName as string | undefined;
        const lastName = req.query.lastName as string | undefined;
        const leagueId = req.query.leagueId as string | undefined;
        const pageNumber = parseInt(req.query.page as string, 10) || 1;
        const limitNumber = parseInt(req.query.limit as string, 10) || 10;
        const sortByString = req.query.sortBy as string;
        const sortBy: SortByEnum = Object.values(SortByEnum).includes(sortByString as SortByEnum)
            ? sortByString as SortByEnum
            : SortByEnum.CreatedAt;
        const isAscString = req.query.isAsc as string || "true";
        const isAsc = isAscString === 'true' ? true : false;

        if (userName === undefined && firstName === undefined && lastName === undefined) {
            const errorResponse: ApiError = {
                error: "Bad Request",
                success: false,
                message: 'Username, first name, or last name is required for search',
                statusCode: 400
            }
            res.status(400).json(errorResponse);
            return;
        }
        if (!leagueId) {
            const errorResponse: ApiError = {
                error: "Bad Request",
                success: false,
                message: 'League ID is required for search',
                statusCode: 400
            }
            res.status(400).json(errorResponse);
            return;
        }

        if (!await leagueRepository.getLeagueByLeagueId(leagueId)) {
            const errorResponse: ApiError = {
                error: "Not Found",
                success: false,
                message: 'League not found',
                statusCode: 404
            }
            res.status(400).json(errorResponse);
            return;
        }

        const { profiles, pagination } = await profileService.searchForProfilesToInviteToLeague({
            userName,
            firstName,
            lastName,
            leagueId,
            page: pageNumber,
            limit: limitNumber,
            sortBy,
            isAsc
        });

        const response: SearchProfilesForLeagueInviteResponse = {
            success: true,
            message: profiles.length === 0 ? 'No matching profiles found' : 'Found matching profiles',
            statusCode: 200,
            responseData: {
                profilesFound: profiles,
                pagination
            }
        }
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}