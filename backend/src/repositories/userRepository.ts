import { models } from "../config/db";
import { UserAttributes } from '../models/User';

/**
 * A repository for interacting with the `User` model in the database.
 * This repository provides methods for finding, creating, and interacting with user records in the database.
 * 
 * The `userRepository` includes the following methods:
 * - `findUserByUsername`: Retrieves a user based on their username.
 * - `findUserByEmail`: Retrieves a user based on their email address.
 * - `createUser`: Creates a new user in the database with the provided details.
 * 
 * @module userRepository
 */
const userRepository = {
    /**
     * Finds and returns a user from the database based on their username.
     * This method searches the `User` model for a user whose `USER_NAME` field matches the provided username.
     * 
     * @param {string} username - The username of the user to retrieve.
     * 
     * @returns {Promise<UserAttributes | null>} - A promise that resolves to a `UserAttributes` object representing the user,
     *          or `null` if no user is found with the provided username.
     * 
     * @throws {Error} - If there is an issue fetching the user from the database.
     * 
     * @example
     * const user = await userRepository.findUserByUsername('johnDoe');
     * console.log(user);  // Logs the user object or null if not found.
     */
    findUserByUsername: async (username: string) : Promise<UserAttributes | null> => {
        return await models.User.findOne({ where: { USER_NAME: username } })
    },
    /**
     * Finds and returns a user from the database based on their email address.
     * This method searches the `User` model for a user whose `USER_EMAIL` field matches the provided email address.
     * 
     * @param {string} email - The email address of the user to retrieve.
     * 
     * @returns {Promise<UserAttributes | null>} - A promise that resolves to a `UserAttributes` object representing the user,
     *          or `null` if no user is found with the provided email address.
     * 
     * @throws {Error} - If there is an issue fetching the user from the database.
     * 
     * @example
     * const user = await userRepository.findUserByEmail('john@example.com');
     * console.log(user);  // Logs the user object or null if not found.
     */
    findUserByEmail: async (email: string) : Promise<UserAttributes | null> => {
        return await models.User.findOne({ where: { USER_EMAIL: email } });
    },
    /**
     * Creates a new user record in the database with the provided details.
     * This method creates a new user using the `User` model and assigns the provided user ID, profile ID, username, and email.
     * Optionally, it can include a user's first and last name if provided.
     * 
     * @param {string} userId - The unique ID of the user to be created.
     * @param {string} userProfileId - The profile ID associated with the user.
     * @param {string} username - The username of the user to be created.
     * @param {string} email - The email address of the user to be created.
     * @param {string} [firstName] - The first name of the user (optional).
     * @param {string} [lastName] - The last name of the user (optional).
     * 
     * @returns {Promise<UserAttributes | null>} - A promise that resolves to a `UserAttributes` object representing the newly created user,
     *          or `null` if the user could not be created.
     * 
     * @throws {Error} - If there is an issue creating the user in the database.
     * 
     * @example
     * const newUser = await userRepository.createUser('user123', 'profile456', 'johnDoe', 'john@example.com', 'John', 'Doe');
     * console.log(newUser);  // Logs the newly created user object.
     */
    createUser: async (userId: string, userProfileId: string, username: string, email: string, firstName?: string, lastName?: string): Promise<UserAttributes | null> => {
        return await models.User.create({
            USER_NAME: username,
            USER_PROFILE_ID: userProfileId,
            USER_EMAIL: email,
            USER_ID: userId
        })
    }
};

export default userRepository;