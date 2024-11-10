import { Transaction } from "sequelize";
import { models } from "../config/db";
import logger from "../config/logger";
import { ProfileAttributes } from "../models/Profile";
import { UserAttributes } from "../models/User";
import errorFactory from "../utils/errors/errorFactory";
import { INTERNAL_SERVER_ERROR } from "../constants/auth/responseErrorConstants";

const profileRepository = {

    /**
     * Creates a new profile record for a user.
     * 
     * @param input - The profile data to create a new profile.
     * @param transaction - The transaction used for atomic operations (optional).
     * 
     * @returns A promise that resolves to the newly created profile record.
     */
    createProfileRecord: async (
        input: ProfileAttributes,
        transaction?: Transaction
    ): Promise<ProfileAttributes> => {
        try {
            const profileRecord = (await models.Profile.create(input, { transaction })).get({plain: true}) as ProfileAttributes;

            if (!profileRecord) {
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }
            
            return profileRecord;
        } catch (error) {
            logger.error(`Failed to createProfile record for profile id ${input.profileId}: ${error}`);
            throw error;
        }
    },

    /**
     * Retrieves a profile by its Profile ID.
     * 
     * @param profileId - The ID of the profile to retrieve.
     * 
     * @returns A promise that resolves to the profile record.
     */
    getProfileRecordByProfileId: async (
        profileId: ProfileAttributes["profileId"]
    ): Promise<ProfileAttributes> => {
        try {
            const profileRecord = await models.Profile.findOne({
                where: { profileId },
            });

            if (!profileRecord) {
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }

            logger.debug('Profile record found by Profile ID:', profileRecord.toJSON());
            return profileRecord;
        } catch (error) {
            logger.error(`Failed to get profile record by profile id ${profileId}: ${error}`);
            throw error;
        }
    },

    /**
     * Retrieves a profile by its associated User ID.
     * 
     * @param userId - The ID of the user whose profile is to be retrieved.
     * 
     * @returns A promise that resolves to the profile record.
     */
    getProfileRecordByUserId: async (
        userId: UserAttributes["userId"]
    ): Promise<ProfileAttributes> => {

        try {
            const profileRecord = await models.Profile.findOne({
                include: {
                    model: models.User,
                    required: true,
                    where: { USER_ID: userId },
                },
            });

            if (!profileRecord) {
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }

            logger.debug('Profile record found by User ID:', profileRecord);
            return profileRecord;
        } catch (error) {
            logger.error(`Failed to get profile record by userId ${userId}: ${error}`);
            throw error;
        }

    },
};

export default profileRepository;