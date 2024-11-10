import { Transaction } from "sequelize";
import { models } from "../config/db";
import logger from "../config/logger";
import { UserAttributes } from '../models/User';
import errorFactory from "../utils/errors/errorFactory";
import { EMAIL_NOT_FOUND, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from "../constants/auth/responseErrorConstants";

const userRepository = {

    /**
     * Checks if a username is available.
     * @param username - The username to check.
     * @returns A boolean indicating if the username is available.
     * @throws An error if the query fails.
     */
    isUsernameAvailable: async (username: UserAttributes["USER_NAME"]): Promise<boolean> => {
        try {
            const userRecord = await models.User.findOne({ where: { USER_NAME: username } });
            return !userRecord;  // Return true if the username is available
        } catch (error) {
            logger.error(`Failed to check availability of username ${username}: ${error}`);
            throw error;
        }
    },

    /**
     * Checks if an email is available.
     * @param email - The email to check.
     * @returns A boolean indicating if the email is available.
     * @throws An error if the query fails.
     */
    isEmailAvailable: async (email: UserAttributes["USER_EMAIL"]): Promise<boolean> => {
        try {
            const userRecord = await models.User.findOne({ where: { USER_EMAIL: email } });
            return !userRecord;  // Return true if the email is available
        } catch (error) {
            logger.error(`Failed to check availability of email ${email}: ${error}`);
            throw error;
        }
    },

    /**
     * Finds a user record by username.
     * @param username - The username to search for.
     * @returns The user record if found.
     * @throws A 404 error if no user is found.
     */
    findUserRecordByUsername: async (username: UserAttributes["USER_NAME"]): Promise<UserAttributes> => {
        try {
            const userRecord = await models.User.findOne({ where: { USER_NAME: username } });
            if (!userRecord) {
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }
            logger.debug(`User found by username: ${username}`);
            return userRecord;
        } catch (error) {
            logger.error(`Failed to get user record by username ${username}: ${error}`);
            throw error;
        }
    },

    /**
     * Finds a user record by email.
     * @param email - The email to search for.
     * @returns The user record if found.
     * @throws A 404 error if no user is found.
     */
    findUserRecordByEmail: async (email: UserAttributes["USER_EMAIL"]): Promise<UserAttributes> => {
        try {
            const userRecord = await models.User.findOne({ where: { USER_EMAIL: email } });
            if (!userRecord) {
                logger.error(`User with email: ${email} does not exist in the database.`)
                throw errorFactory(EMAIL_NOT_FOUND);
            }
            logger.debug(`User found by email: ${email}`);
            return userRecord;
        } catch (error) {
            logger.error(`Failed to get user record by email ${email}: ${error}`);
            throw error;
        }
    },

    /**
     * Creates a new user record.
     * @param input - The user data to create the user record.
     * @param transaction - The transaction object (optional).
     * @returns The created user record.
     * @throws A 500 error if the creation fails.
     */
    createUserRecord: async (input: UserAttributes, transaction?: Transaction): Promise<UserAttributes> => {
        try {
            const userRecord = await models.User.create(input, { transaction });
            if (!userRecord) {
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }
            return userRecord;
        } catch (error) {
            logger.error(`Failed to create user record for (username, userId): (${input.USER_NAME}, ${input.USER_ID}): ${error}`);
            throw error;
        }
    },
};

export default userRepository;