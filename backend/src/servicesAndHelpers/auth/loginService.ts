import userRepository from "../../repositories/userRepository";
import userService from "../user/userService";
import errorFactory from "../../utils/errors/errorFactory";
import authResponseFormatter from "../../utils/apiResponseFormatters/authResponseFormatter";
import { LoginFields, AuthLoginResponseData } from "../../types/auth/authTypes";
import authService from "./authService";


const loginService = {
    /**
     * Logs a user in by validating credentials and generating a JWT token.
     * 
     * Steps:
     * 1. Validates the input (email and password).
     * 2. Checks if a user exists with the provided email.
     * 3. Authenticates the password.
     * 4. Generates a JWT token if authentication is successful.
     * 5. Returns a formatted response with user data and the generated token.
     * 
     * @param {LoginFields} fields - The login credentials, containing `email` and `password`.
     * @returns {Promise<AuthLoginResponseData>} - Returns a promise that resolves to the login response data, including the generated JWT token and user information.
     * 
     * @throws {Error} - Throws an error if any of the following conditions occur:
     * - Missing email or password results in a `400` status code and an error message of `'Email and password are required.'`.
     * - No user is found for the provided email results in a `404` status code and an error message of `'No account tied to the provided email.'`.
     * - Incorrect password results in a `401` status code and an error message of `'Incorrect password. Please try again.'`.
     * 
     * @example
     * const loginData: LoginFields = { email: 'test@example.com', password: 'securePassword123' };
     * const responseData = await loginService.login(loginData);
     * console.log(responseData); // Returns an AuthLoginResponseData object with token and user details.
     */
    login: async (fields: LoginFields): Promise<AuthLoginResponseData> => {
        // Step 1: Input Validation
        const { email, password } = fields;

        if (!email || !password) {
            throw errorFactory({
                message: "Email and password are required",
                statusCode: 400
            });
        }

        // Step 2: Find User by Email
        const userRecord = await userRepository.findUserByEmail(email.toLowerCase());
        if (!userRecord) {
            throw errorFactory({
                message: "No account tied to the provided email",
                statusCode: 404
            });
        }

        // Step 3: Authenticate User's Password
        const isAuthenticated = await userService.authenticateUser(userRecord, password);
        if (!isAuthenticated) {
            throw errorFactory({
                message: "Incorrect password. Please try again",
                statusCode: 401
            });
        }

        // Step 4: Generate JWT Token
        const token = authService.tokenService.generateToken({
            user: userRecord.USER_ID
        });

        // Step 5: Return Formatted Response
        return authResponseFormatter.formatLoginResponse(
            200, 
            'User authenticated successfully', 
            userRecord, 
            token
        );
    }
};

export default loginService;