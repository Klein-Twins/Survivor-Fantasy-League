import jwt from 'jsonwebtoken';
import errorFactory from '../utils/errors/errorFactory';
import {Request, Response, NextFunction } from 'express';

import { JWT_SECRET } from '../config/config';

interface AuthenticatedRequest extends Request {
    user?: string | jwt.JwtPayload; // User payload can be a string or an object
}
/**
 * Middleware function to authenticate JSON Web Token (JWT) from the `Authorization` header.
 * 
 * This middleware checks if a valid JWT is provided in the `Authorization` header of the incoming request.
 * It verifies the token using the JWT secret and attaches the decoded user data to the `req.user` property.
 * If the token is missing, invalid, or expired, an appropriate error response is sent.
 *
 * @param {AuthenticatedRequest} req - The request object, extended to include `user` property if authenticated.
 * @param {Response} res - The response object used to send back the error or success response.
 * @param {NextFunction} next - The next function to pass control to the next middleware or route handler.
 * 
 * @returns {void} - Does not return a value. Calls `next()` to proceed to the next middleware or route handler if the token is valid.
 * 
 * @throws {401} If the token is missing from the `Authorization` header.
 * @throws {403} If the token is invalid or expired.
 * 
 * @example
 * // Usage in an Express route handler:
 * app.use('/protected-route', authenticateToken, (req, res) => {
 *     res.send('This is a protected route');
 * });
 */
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Get token from the 'Authorization' header (assumes "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If token is missing, return 401 Unauthorized error
    if (!token) {
        return next(errorFactory({ message: 'Access token required', statusCode: 401 }));
    }

    // Verify the token using JWT_SECRET
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            // If the token is invalid or expired, return 403 Forbidden error
            return next(errorFactory({ message: 'Invalid or expired token', statusCode: 403 }));
        }

        // Attach decoded user data to the request object for subsequent use
        req.user = decoded;

        // Call the next middleware or route handler
        next();
    });
};

export default authenticateToken;