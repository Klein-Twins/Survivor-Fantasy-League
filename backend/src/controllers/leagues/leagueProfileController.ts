import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";
import errorFactory from "../../utils/errors/errorFactory";
import { ProfileSearchParams, ProfileSearchResultsWithPagination } from "../../types/profile/profileTypes";
import profileService from "../../servicesAndHelpers/profile/profileService";


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

    inviteProfileToLeague: (req: Request, res: Response, next: NextFunction) => {

    }
}

export default leagueProfileController;