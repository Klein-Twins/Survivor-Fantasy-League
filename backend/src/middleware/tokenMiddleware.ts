import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config/config';
import { AccountAttributes } from '../repositories/accountRepository';
import tokenService from '../servicesAndHelpers/auth/tokenService';
import errorFactory from '../utils/errors/errorFactory';

interface AuthenticatedRequest extends Request {
    user?: string | jwt.JwtPayload; // The user payload can be a string or a decoded JWT object
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

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(errorFactory({ message: 'Invalid or expired token', statusCode: 403 }));
            }
            req.user = decoded;
            next();
        });
    },

    /**
     * Middleware to generate a JWT token for an authenticated user.
     * It retrieves the user data from `res.locals.user`, generates a token, and adds it to the response.
     *
     * @param req - The Express request object.
     * @param res - The Express response object, where the token will be set.
     * @param next - The next middleware function in the stack.
     */
    generateToken: (req: Request, res: Response, next: NextFunction): void => {
        try {
            const account = res.locals.user as AccountAttributes;

            if (!account) {
                throw errorFactory({ statusCode: 500, message: "User data missing for token generation" });
            }

            // Generate a JWT token using the user's account ID
            const token = tokenService.generateToken({ userId: account.USER_ID });

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