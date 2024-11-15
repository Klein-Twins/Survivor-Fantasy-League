import { models, sequelize } from "../config/db";
import logger from "../config/logger";
import { ACCOUNT_NOT_FOUND_ERROR } from "../constants/auth/responseErrorConstants";
import { PasswordAttributes } from "../models/Password";
import { ProfileAttributes } from "../models/Profile";
import { UserAttributes } from "../models/User";
import passwordService from "../servicesAndHelpers/password/passwordService";
import profileService from "../servicesAndHelpers/profile/profileService";
import userService from "../servicesAndHelpers/user/userService";
import { AccountAndPassword, UserIncludeProfile } from "../types/auth/authTypes";
import errorFactory from "../utils/errors/errorFactory";

/**
 * Repository for managing account-related operations, including creating accounts
 * and retrieving accounts by email.
 */
const accountRepository = {
    createAccount: async (inputAccountData: AccountAndPassword): Promise<{ profileRecord: ProfileAttributes, userRecord: UserAttributes, passwordRecord: PasswordAttributes }> => {
        const transaction = await sequelize.transaction();
        logger.debug("Transaction Created.");
        try {
            const profileRecord: ProfileAttributes = await profileService.createProfileForAccount(inputAccountData, transaction)
            const userRecord: UserAttributes = await userService.createUserForAccount(inputAccountData, transaction);
            const passwordRecord: PasswordAttributes = await passwordService.createPasswordForAccount(inputAccountData, transaction)

            await transaction.commit();
            logger.debug("Transaction committed. Account created in DB");

            return { profileRecord, passwordRecord, userRecord };
        } catch (error) {
            await transaction.rollback();
            logger.error(`Transaction rolledback. Error creating and persisting account into DB: ${error}`)
            throw error;
        }
    },

    getAccountByEmail: async (email: UserAttributes["email"]): Promise<UserIncludeProfile> => {
        try {
            const userAndProfileRecord = await models.User.findOne({
                include: {
                    model: models.Profile,
                    as: 'profile',
                    required: true,
                },
                where: {
                    email
                }
            }) as unknown as UserIncludeProfile;

            if (!userAndProfileRecord) {
                throw errorFactory(ACCOUNT_NOT_FOUND_ERROR);
            }

            return userAndProfileRecord;
        } catch (error) {
            logger.error(`Error getting account for email ${email}: ${error}`);
            throw error;
        }
    }
}

export default accountRepository;