import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";

const profileController = {
    getProfilesBySearch: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        logger.debug("In profileController.getProfilesBySearch");
        try {

        } catch (error) {
            next(error);
        }
    }
}

export default profileController;