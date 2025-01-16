import { Transaction } from "sequelize";
import { models } from "../config/db";
import logger from "../config/logger";
import { UserAttributes } from '../models/User';
import errorFactory from "../utils/errors/errorFactory";
import { EMAIL_NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from "../constants/auth/responseErrorConstants";
import { UnauthorizedError } from "../utils/errors/errors";
import { ProfileAttributes } from "../models/Profile";

const userRepository = {

    /**
     * Checks if a username is available.
     * @param username - The username to check.
     * @returns A boolean indicating if the username is available.
     * @throws An error if the query fails.
     */
    isUsernameAvailable: async (userName: UserAttributes["userName"]): Promise<boolean> => {
        try {
            const userRecord = await models.User.findOne({ where: { userName } });
            return !userRecord;  // Return true if the username is available
        } catch (error) {
            logger.error(`Failed to check availability of username ${userName}: ${error}`);
            throw error;
        }
    },

    /**
     * Checks if an email is available.
     * @param email - The email to check.
     * @returns A boolean indicating if the email is available.
     * @throws An error if the query fails.
     */
    isEmailAvailable: async (email: UserAttributes["email"]): Promise<boolean> => {
        try {
            const userRecord = await models.User.findOne({ where: { email } });
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
    findUserRecordByUsername: async (userName: UserAttributes["userName"]): Promise<UserAttributes> => {
        try {
            const userRecord = await models.User.findOne({ where: { userName } });
            if (!userRecord) {
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }
            logger.debug(`User found by username: ${userName}`);
            return userRecord;
        } catch (error) {
            logger.error(`Failed to get user record by username ${userName}: ${error}`);
            throw error;
        }
    },
    getUserByProfileId: async (profileId: ProfileAttributes["profileId"]): Promise<UserAttributes> => {
        try {
            const userRecord = await models.User.findOne({ where: { profileId } });
            if (!userRecord) {
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }
            logger.debug(`User found by profileId: ${profileId}`);
            return userRecord;
        } catch (error) {
            logger.error(`Failed to get user record by profileId: ${profileId}: ${error}`);
            throw error;
        }
    },

    /**
     * Finds a user record by email.
     * @param email - The email to search for.
     * @returns The user record if found.
     * @throws A 404 error if no user is found.
     */
    findUserRecordByEmail: async (email: UserAttributes["email"]): Promise<UserAttributes | null> => {
        return await models.User.findOne({ where: { email } });
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
            logger.error(`Failed to create user record for (username, userId): (${input.userName}, ${input.userId}): ${error}`);
            throw error;
        }
    },

    getUserIdByProfileId: async (profileId: string): Promise<string | null> => {
        const user = await models.User.findOne({
            where: {
                profileId: profileId
            }
        })
        return user ? user.userId : null
    }
};

export default userRepository;