import { Request, Response, NextFunction } from 'express';

import authService from '../../servicesAndHelpers/auth/authService';
import errorFactory from '../../utils/errors/errorFactory';

const logoutController = {
    /**
     * Handles user logout by invalidating the authentication token.
     * 
     * This method expects a request with the token included in the `Authorization` header (in the format "Bearer <token>").
     * The process is as follows:
     * 1. It extracts the token from the `Authorization` header.
     * 2. If the token is missing, it throws an error with a `401` status code indicating the required token is absent.
     * 3. It calls the `logout` service to invalidate the token.
     * 4. If the token is successfully invalidated, it sends a response with a status of `200` and the result from the logout service.
     * 5. In case of any errors, it passes the error to the next middleware for proper error handling.
     * 
     * @param {Request} req - The Express request object, which contains the authentication token in the `Authorization` header.
     * 
     * @param {Response} res - The Express response object used to send back the logout response.
     * 
     * @param {NextFunction} next - The Express next function used to pass control to the next middleware in case of an error.
     * 
     * @returns {Promise<void>} - This function returns a promise that resolves to `void`. It does not return any value, but instead sends a response to the client.
     * 
     * @throws {401} If the token is missing or invalid, the middleware throws an error indicating the token is required or invalid.
     * 
     * @example
     * // Example usage in an Express route handler:
     * app.post('/logout', logoutController.logout);
     * 
     * @remarks
     * The logout process relies on invalidating the authentication token, which prevents further authenticated requests using the token. 
     * The implementation ensures the token is securely invalidated by the backend service (e.g., database revocation or blacklisting).
     */
    logout: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // Extract the token from the 'Authorization' header
        const token = req.headers.authorization?.split(' ')[1];

        try {
            if (!token) throw errorFactory({ message: "Token is required", statusCode: 401 });

            // Call the logout service to invalidate the token
            const result = await authService.logoutService.logout(token);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default logoutController;