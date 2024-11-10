import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config/config';
import tokenService from '../servicesAndHelpers/auth/tokenService';
import errorFactory from '../utils/errors/errorFactory';
import { BLACKLISTED_TOKEN_ERROR, INTERNAL_SERVER_ERROR, INVALID_TOKEN_ERROR } from '../constants/auth/responseErrorConstants';
import logger from '../config/logger';
import { Account } from '../types/auth/authTypes';

export interface AuthenticatedRequest extends Request {
    decodedToken?: string | jwt.JwtPayload; // The user payload can be a string or a decoded JWT object
}

const tokenMiddleware = {
    /**
     * Middleware to authenticate a JWT token from the 'Authorization' header.
     * If the token is valid, it adds the decoded user data to the request object.
     * If the token is missing or invalid, it responds with an error.
     *
     * @param req - The Express request object, extended to include a user property.
     * @param res - The Express response object.
     * @param next - The next middleware function in the stack.
     */
    authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return next(errorFactory({ message: 'Access token required', statusCode: 401 }));
        }

        if(tokenService.isTokenBlacklisted(token)) {
            logger.debug("Token was already blacklisted. Not authenticated...");
            return next(errorFactory(BLACKLISTED_TOKEN_ERROR));
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(errorFactory(INVALID_TOKEN_ERROR));
            }
            req.decodedToken = decoded;
            logger.debug(decoded);
            next();
        });
    },

    /**
     * Middleware AFTER controller to generate a JWT token for an authenticated user.
     * It retrieves the user data from `res.locals.user`, generates a token, and adds it to the response.
     *
     * @param req - The Express request object.
     * @param res - The Express response object, where the token will be set.
     * @param next - The next middleware function in the stack.
     */
    generateToken: (req: Request, res: Response, next: NextFunction): void => {
        try {
            const account : Account = res.locals.account;
            logger.debug(account);

            if (!account) {
                logger.error("Account data missing for token generation");
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }

            // Generate a JWT token using the user's account ID
            const token = tokenService.generateToken({
                profileId: account.profileId,
                userName: account.userName
            });

            // Set the Authorization header with the generated token
            res.set("Authorization", `Bearer ${token}`)
                .status(200)
                .json({
                    message: "Authentication successful",
                    account, // Return the account information in the response
                });
        } catch (error) {
            next(error); // Pass the error to the error-handling middleware
        }
    }
};

export default tokenMiddleware;