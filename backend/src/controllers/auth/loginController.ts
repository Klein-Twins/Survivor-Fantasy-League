import { Request, Response, NextFunction } from 'express';

import { AuthLoginResponseData, LoginFields } from '../../types/auth/authTypes';

import authService from '../../servicesAndHelpers/auth/authService';
import { validateLoginRequestData } from '../../servicesAndHelpers/auth/authHelper';

/**
 * loginController
 * 
 * Controller for handling login requests. It processes the login request data,
 * validates it, and interacts with the authentication service to authenticate the user.
 * If successful, it returns a response with a JWT token. If there is an error,
 * it passes the error to the next middleware for handling.
 */
const loginController = {
    /**
     * Handles user login by validating login credentials, authenticating the user,
     * and returning an authentication token upon successful login.
     * 
     * This method expects a JSON body containing the user's email and password. It performs the following steps:
     * 1. Validates the provided login data (email and password).
     * 2. Sends the login data to the authentication service to authenticate the user.
     * 3. If authentication is successful, it returns an `Authorization` token in the response headers and sends back the user data.
     * 4. In case of an error, it passes the error to the next middleware for proper error handling.
     * 
     * @param {Request} req - The Express request object containing the login credentials (email and password).
     * 
     * @param {Response} res - The Express response object used to send back the login response.
     * 
     * @param {NextFunction} next - The Express next function used to pass control to the next middleware if an error occurs.
     * 
     * @returns {Promise<void>} - This function returns a promise that resolves to `void`. It doesn't directly return anything but sends a response to the client.
     * 
     * @throws {400} If the provided login data is invalid (e.g., missing or malformed email/password).
     * @throws {401} If the login attempt fails (e.g., incorrect credentials).
     * 
     * @example
     * // Example usage in an Express route handler:
     * app.post('/login', loginController.login);
     * 
     * @remarks
     * The `Authorization` header in the response will contain a Bearer token, which can be used for subsequent authenticated requests.
     * The login process involves checking the user's credentials and generating a JWT token upon successful login.
     */
    login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const requestData = {email: req.body.email, password : req.body.password};
            validateLoginRequestData(requestData);

            const responseData: AuthLoginResponseData = await authService.loginService.login(requestData);

            res.set('Authorization', `Bearer ${responseData.token}`)
               .status(responseData.statusCode)
               .json({ message: responseData.message, user: responseData.user });
        } catch (error) {
            next(error);
        }
    }
}

export default loginController;