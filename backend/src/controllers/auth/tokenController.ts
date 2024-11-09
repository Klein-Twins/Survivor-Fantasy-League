import { Request, Response, NextFunction } from "express";
import tokenService from "../../servicesAndHelpers/auth/tokenService";
import errorFactory from "../../utils/errors/errorFactory";
import { AccountAttributes } from "../../repositories/accountRepository";
import logger from "../../config/logger";

/**
 * Controller responsible for token-related actions.
 */
const tokenController = {
    /**
     * Middleware to generate a JWT token for an authenticated user and attach it to the response.
     *
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction for passing control to error handling middleware
     * @returns void
     *
     * @description
     * Checks for account information in `res.locals.user`, then generates a JWT token based on the account's `USER_ID`.
     * If account data is missing, an error is thrown.
     * The token is added to the "Authorization" header, and a JSON response is sent back with a success message and account details.
     */
    generateToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const account = res.locals.account as AccountAttributes;
            logger.debug(account);
            // Ensure user data is available for token generation
            if (!account) {
                throw errorFactory({ statusCode: 500, message: "User data missing for token generation" });
            }

            // Generate JWT token
            const token = tokenService.generateToken({ userId: account.USER_ID });

            // Set Authorization header and send response
            res.set("Authorization", `Bearer ${token}`)
                .status(200)
                .json({
                    message: "Authentication successful",
                    account,
                });
        } catch (error) {
            next(error); // Pass error to error-handling middleware
        }
    }
};

export default tokenController;