import { models, sequelize } from "../config/db";
import logger from "../config/logger";
import { ACCOUNT_NOT_FOUND } from "../constants/auth/responseErrorConstants";
import { PasswordAttributes } from "../models/Password";
import { ProfileAttributes } from "../models/Profile";
import { UserAttributes } from "../models/User";
import passwordService from "../servicesAndHelpers/password/passwordService";
import profileService from "../servicesAndHelpers/profile/profileService";
import userService from "../servicesAndHelpers/user/userService";
import { Account, AccountAndPassword, UserIncludeProfile } from "../types/auth/authTypes";
import errorFactory from "../utils/errors/errorFactory";

/**
 * Repository for managing account-related operations, including creating accounts
 * and retrieving accounts by email.
 */
const accountRepository = {
    /**
     * Creates a new account with associated user, profile, and password records.
     * @param inputAccountData - Data needed to create a new account.
     * @returns The created account details without password.
     * @throws Will throw an error if the account creation fails.
     */
    createAccount: async (inputAccountData : AccountAndPassword): Promise<Account> => {
        const transaction = await sequelize.transaction();
        logger.debug("Created transaction");
        try {
            const profileRecord : ProfileAttributes = await profileService.createProfileForAccount(inputAccountData, transaction)
            const userRecord : UserAttributes = await userService.createUserForAccount(inputAccountData, transaction);
            const passwordRecord : PasswordAttributes = await passwordService.createPasswordForAccount(inputAccountData, transaction)

            await transaction.commit();
            logger.debug("Transaction committed");

            const account : Account = {
                profileId: profileRecord.profileId,
                email: userRecord.email,
                userName: userRecord.userName,
                userId: userRecord.userId,
                firstName: profileRecord.firstName,
                lastName: profileRecord.lastName,
                imageUrl: profileRecord.imageUrl,
            }

            logger.debug("Account created in DB");
            logger.debug(account);

            return account;
        } catch (error) {
            logger.error(`Error creating and persisting account into DB: ${error}`)
            await transaction.rollback();
            logger.debug("Transaction rolled back");
            throw error;
        }
    },

    /**
     * Retrieves an account by the user's email address.
     * @param email - The email address of the user to retrieve.
     * @returns The account data if found.
     * @throws Will throw an error if no account is found with the given email.
     */
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
                throw errorFactory(ACCOUNT_NOT_FOUND);
            }

            logger.debug(userAndProfileRecord);

            return userAndProfileRecord;
        } catch(error) {
            logger.error(`Error getting account for email ${email}: ${error}`);
            throw error;
        }
    }
}

export default accountRepository;