import { v4 as uuidv4 } from 'uuid';
import userRepository from '../../repositories/userRepository';
import passwordRepository from '../../repositories/passwordRepository';
import errorFactory from '../../utils/errors/errorFactory';
import passwordService from '../password/passwordService';

import { UserAttributes } from "../../models/User";
import { SignupFields } from '../../types/auth/authTypes';

/**
 * The `userService` module is responsible for handling operations related to user management.
 * It includes functions for creating a user, authenticating a user, and password handling.
 * 
 * ### Available Functions:
 * - `createUser`: Creates a new user with the provided data.
 * - `authenticateUser`: Authenticates a user by verifying their password.
 *
 * ### Example Usage:
 * ```typescript
 * const newUser = await userService.createUser(signupFields);
 * console.log(newUser); // New user data
 * 
 * const isAuthenticated = await userService.authenticateUser(userRecord, 'userpassword');
 * console.log(isAuthenticated); // true or false
 * ```
 */
const userService = {

  /**
   * Creates a new user and saves the user data and password to the database.
   * This function performs the following steps:
   * 1. Generates unique UUIDs for the user and user profile.
   * 2. Saves the user data to the `userRepository`.
   * 3. Saves the password to the `passwordRepository`.
   *
   * ### Parameters:
   * - `fields` (Object): The data required to create a new user.
   *   - `username` (string): The user's chosen username.
   *   - `email` (string): The user's email address.
   *   - `firstName` (string): The user's first name.
   *   - `lastName` (string): The user's last name.
   *   - `password` (string): The user's password.
   *
   * ### Returns:
   * - A promise that resolves to the created user data (`UserAttributes`).
   * 
   * ### Throws:
   * - If user or password creation fails, it throws a `500 Internal Server Error` with the message `"Could not create user"`.
   *
   * ### Example:
   * ```typescript
   * const user = await userService.createUser({
   *   username: 'johndoe',
   *   email: 'johndoe@example.com',
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   password: 'password123'
   * });
   * console.log(user); // User data
   * ```
   *
   * @param {signupFields} fields - User data for creating a new user.
   * @returns {Promise<UserAttributes>} - A promise that resolves to the newly created user.
   * @throws {Error} - If user creation or password creation fails.
   */
  createUser: async (fields: SignupFields): Promise<UserAttributes> => {

    // Generate unique UUIDs for user and user profile
    const userProfileId = uuidv4();
    const userId = uuidv4();
  
    // Create the user in the user repository
    const userRecord = await userRepository.createUser(
      userId,
      userProfileId,
      fields.username,
      fields.email.toLowerCase(),
      fields.firstName,
      fields.lastName
    );
  
    if (!userRecord) {
      throw errorFactory({
        message: 'Could not create user',
        statusCode: 500
      });
    }
  
    // Create the password in the password repository
    const passwordRecord = passwordService.createPassword(userRecord, fields.password);
  
    if (!passwordRecord) {
      throw errorFactory({
        message: 'Could not create user',
        statusCode: 500
      });
    }
  
    return userRecord;
  },

  /**
   * Authenticates a user by checking the provided password against the stored password.
   * This function performs the following tasks:
   * 1. Retrieves the active password record associated with the user.
   * 2. Verifies that the provided password matches the stored password using `passwordService`.
   * 
   * ### Parameters:
   * - `userRecord` (UserAttributes): The user record containing the user's data.
   * - `password` (string): The password to authenticate the user.
   *
   * ### Returns:
   * - A promise that resolves to `true` if the password is valid, `false` if it is invalid.
   *
   * ### Throws:
   * - If no active password record is found, it throws a `401 Unauthorized` error with the message `"Please reset your password"`.
   *
   * ### Example:
   * ```typescript
   * const isAuthenticated = await userService.authenticateUser(userRecord, 'userpassword');
   * console.log(isAuthenticated); // true or false
   * ```
   *
   * @param {UserAttributes} userRecord - The user data to authenticate.
   * @param {string} password - The password to check.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the password is correct.
   * @throws {Error} - If the active password record is missing.
   */
  authenticateUser: async (userRecord: UserAttributes, password: string): Promise<boolean> => {
    // Retrieve the active password record for the user
    const activePasswordRecord = await passwordRepository.getActivePassword(userRecord);
  
    if (!activePasswordRecord) {
      throw errorFactory({
        message: 'Please reset your password',
        statusCode: 401
      });
    }
  
    // Check the provided password against the stored password
    return await passwordService.checkPasswordAgainstUserPassword(userRecord, password);
  },
};

export default userService;