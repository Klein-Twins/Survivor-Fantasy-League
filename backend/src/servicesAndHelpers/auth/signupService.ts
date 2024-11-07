import userRepository from "../../repositories/userRepository";
import userService from "../user/userService";
import errorFactory from "../../utils/errors/errorFactory";
import authResponseFormatter from "../../utils/apiResponseFormatters/authResponseFormatter";
import { SignupFields, AuthSignupResponseData } from "../../types/auth/authTypes";
import authService from "./authService";

const signupService = {
    /**
     * Registers a new user based on the provided email, username, and password.
     *
     * This function performs the following tasks:
     * 1. Checks if the provided email is already tied to an existing account.
     * 2. Checks if the provided username is already taken by another user.
     * 3. Creates a new user record in the database.
     * 4. Generates a JWT token for the newly created user.
     * 5. Formats and returns the signup response in a consistent structure.
     *
     * ### Parameters:
     * - `fields` (Object): The object containing the user's signup details.
     *   - `email` (string): The email of the user attempting to register.
     *   - `username` (string): The username chosen by the user.
     *   - `password` (string): The password chosen by the user.
     *
     * ### Returns:
     * - A promise that resolves to an object of type `AuthSignupResponseData`. This contains:
     *   - `statusCode` (number): HTTP status code for the response.
     *   - `message` (string): Success message indicating that the user has been successfully created.
     *   - `user` (Object): The newly created user's data.
     *   - `token` (string): A JWT token generated for the newly created user.
     *
     * ### Throws:
     * - If the email is already tied to an existing account:
     *   - Throws a `400 Bad Request` error with the message `"Email already tied to account."`
     *
     * - If the username is already taken by another user:
     *   - Throws a `400 Bad Request` error with the message `"Username already tied to account."`
     *
     * ### Usage:
     * ```typescript
     * const signupResponse = await signupService.signup({
     *   email: 'user@example.com',
     *   username: 'user123',
     *   password: 'userpassword'
     * });
     * console.log(signupResponse);  // Returns formatted signup response with user data and token
     * ```
     *
     * @param {SignupFields} fields - Object containing the `email`, `username`, and `password` for user registration.
     * @returns {Promise<AuthSignupResponseData>} - A promise resolving to a signup response containing user data and JWT token.
     * @throws {Error} - Will throw an error with the corresponding HTTP status code and message in case of signup failure.
     */
    signup: async (fields: SignupFields): Promise<AuthSignupResponseData> => {
        // Step 1: Check if the email is already tied to an existing account
        if (await userRepository.findUserByEmail(fields.email.toLowerCase())) {
            throw errorFactory({
                message: 'Email already tied to account',
                statusCode: 400
            });
        }

        // Step 2: Check if the username is already taken
        if (await userRepository.findUserByUsername(fields.username)) {
            throw errorFactory({
                message: 'Username already tied to account',
                statusCode: 400
            });
        }

        // Step 3: Create the user record
        const userRecord = await userService.createUser(fields);

        // Step 4: Generate JWT token for the new user
        const token = authService.tokenService.generateToken({ user: userRecord.USER_ID });

        // Step 5: Return the formatted response with user data and token
        return authResponseFormatter.formatSignupResponse(
            201,
            'User created successfully',
            userRecord, // Newly created user data
            token // JWT token
        );
    }
};

export default signupService;