import { models, sequelize } from "../config/db";
import logger from "../config/logger";
import { PasswordAttributes } from "../models/Password";
import { ProfileAttributes } from "../models/Profile";
import { UserAttributes } from "../models/User";
import passwordService from "../servicesAndHelpers/password/passwordService";
import profileService from "../servicesAndHelpers/profile/profileService";
import userService from "../servicesAndHelpers/user/userService";
import errorFactory from "../utils/errors/errorFactory";

/**
 * Interface for Account attributes, combining user data and profile information.
 */
export interface AccountAttributes {
    USER_NAME : UserAttributes['USER_NAME'],
    USER_EMAIL : UserAttributes['USER_EMAIL'],
    USER_ID : UserAttributes['USER_ID'],
    USER_PROFILE : ProfileAttributes
}

/**
 * Extended interface for Account attributes, including password data.
 */
export interface AccountAndPasswordAttributes extends AccountAttributes{
    PASSWORD : PasswordAttributes['PASSWORD']
} 

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
    createAccount: async (inputAccountData : AccountAndPasswordAttributes): Promise<AccountAttributes> => {
        const transaction = await sequelize.transaction();
        try {
            const profileRecord = await profileService.createProfileForAccount(inputAccountData, transaction)
            const userRecord = await userService.createUserForAccount(inputAccountData, transaction);
            const passwordRecord = await passwordService.createPasswordForAccount(inputAccountData, transaction)

            await transaction.commit();

            const result : AccountAttributes = {
                USER_NAME: userRecord.USER_NAME,
                USER_ID: userRecord.USER_ID,
                USER_EMAIL: userRecord.USER_EMAIL,
                USER_PROFILE : profileRecord,
            }

            logger.debug("Account created in DB", JSON.stringify(result));

            return result;
        } catch (error) {
            logger.error(`Error creating and persisting account into DB: ${error}`)
            await transaction.rollback();
            throw error;
        }
    },

    /**
     * Retrieves an account by the user's email address.
     * @param email - The email address of the user to retrieve.
     * @returns The account data if found.
     * @throws Will throw an error if no account is found with the given email.
     */
    getAccountByEmail: async (email: UserAttributes["USER_EMAIL"]): Promise<AccountAttributes> => {
        try {
            const userAndProfileRecord = await models.User.findOne({
                include: {
                    model: models.Profile,
                    required: true,
                },
                where: {
                    USER_EMAIL: email
                }
            });
    
            if (!userAndProfileRecord) {
                throw errorFactory({ message: "Account not found", statusCode: 404 });
            }
    
            const accountData: AccountAttributes = {
                USER_EMAIL: userAndProfileRecord.USER_EMAIL,
                USER_ID: userAndProfileRecord.USER_ID,
                USER_NAME: userAndProfileRecord.USER_NAME,
                // @ts-ignore
                USER_PROFILE: userAndProfileRecord.Profile
            };
    
            return accountData;
        } catch(error) {
            logger.error(`Error getting account for email ${email}: ${error}`);
            throw error;
        }
    }
}

export default accountRepository;