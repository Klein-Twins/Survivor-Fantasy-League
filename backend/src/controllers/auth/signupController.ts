import { Request, Response, NextFunction } from 'express';

import { AuthSignupResponseData, SignupFields } from '../../types/auth/authTypes';

import authService from '../../servicesAndHelpers/auth/authService';
import { validateSignupRequestData } from '../../servicesAndHelpers/auth/authHelper';

const signupController = {
    /**
     * Handles user signup by validating the signup data, creating a new user, 
     * and generating an authentication token upon successful signup.
     * 
     * This method expects a JSON body containing the user's information such as 
     * username, password, first name, last name, and email. The process follows these steps:
     * 1. It validates the provided signup data (username, password, first name, last name, and email).
     * 2. It sends the signup data to the signup service to create the user and generate a JWT token.
     * 3. If the signup is successful, it returns an `Authorization` token in the response headers and sends back the user data.
     * 4. In case of any validation or service errors, it passes the error to the next middleware for proper error handling.
     * 
     * @param {Request} req - The Express request object containing the user's signup details in the body.
     * 
     * @param {Response} res - The Express response object used to send back the result of the signup process, including the JWT token and user details.
     * 
     * @param {NextFunction} next - The Express next function used to pass control to the next middleware if an error occurs during signup.
     * 
     * @returns {Promise<void>} - This function returns a promise that resolves to `void`, as it doesn't return any value but sends the response to the client.
     * 
     * @throws {400} If the provided signup data is invalid or incomplete (e.g., missing required fields).
     * @throws {409} If the email or username already exists in the system, leading to a conflict error.
     * @throws {500} If there is an internal server error during the user creation or token generation process.
     * 
     * @example
     * // Example usage in an Express route handler:
     * app.post('/signup', signupController.signup);
     * 
     * @remarks
     * Upon successful signup, the `Authorization` header in the response will contain a Bearer token. 
     * This token can be used for subsequent authenticated requests to protected routes.
     * The signup service is responsible for creating the user and generating the JWT token.
     */
    signup: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const requestData : SignupFields = {
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            }
            validateSignupRequestData(requestData);

            // Create a new user and generate a JWT token using the signup service
            const responseData: AuthSignupResponseData = await authService.signupService.signup(requestData);

            res.set('Authorization', `Bearer ${responseData.token}`)
               .status(responseData.statusCode)
               .json({
                   message: responseData.message,
                   user: responseData.user
               });
        } catch (error) {
            next(error);
        }
    }
}

// Export the signupController to be used in other parts of the application
export default signupController;