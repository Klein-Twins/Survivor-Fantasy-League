import survivorService from "../../servicesAndHelpers/survivor/survivorService";
import { Request, Response, NextFunction } from "express";
import { validateQuery } from "../../utils/survivor/survivorUtils";
import { ApiError, GetSurvivorsResponse, Season } from "../../generated-api";
import seasonService from "../../servicesAndHelpers/season/seasonService";

const survivorController = {
    getSurvivors: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const seasonId: any = req.query.seasonId;
        const withDetails: any = req.query.withDetails;

        try {
            validateQuery(seasonId);

            const seasonExists: boolean = await seasonService.doesSeasonExist(seasonId);
            if (!seasonExists) {
                const error: ApiError = {
                    success: false,
                    message: `Season ${seasonId} does not exist`,
                    error: `Season ${seasonId} does not exist`,
                    statusCode: 404
                }
                throw error;
            }

            const survivors = await survivorService.getSurvivorsBySeason(seasonId);
            const response: GetSurvivorsResponse = {
                success: true,
                message: `Survivors received for season ${seasonId}`,
                statusCode: 200,
                responseData: {
                    survivors
                }

            }
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default survivorController;