import { v4 as uuidv4 } from 'uuid';
import { Account, AccountAndPassword, SignupRequestFields, UserIncludeProfile } from '../../types/auth/authTypes';
import accountRepository from '../../repositories/accountRepository';
import userRepository from '../../repositories/userRepository';
import errorFactory from '../../utils/errors/errorFactory';
import { UserAttributes } from '../../models/User';
import { EMAIL_UNAVAILABLE, USERNAME_UNAVAILABLE } from '../../constants/auth/responseErrorConstants';
import logger from '../../config/logger';

/**
 * Service for handling account creation, validation, and retrieval.
 */
const accountService = {
    /**
     * Creates a new account by checking availability of the email and username,
     * generating a user profile, and then creating the account record.
     *
     * @param fields - The signup fields provided by the user.
     * @returns A promise that resolves to the created account details.
     * @throws A 400 error if the email or username is already tied to an account.
     */
    createAccount: async (fields: SignupRequestFields): Promise<Account> => {
        await accountService.checkAccountAvailable(fields.email, fields.username);
        logger.debug("Email and Username are available");

        // Generate UUIDs for user profile and user ID
        const userProfileId = uuidv4();
        const userId = uuidv4();

        const accountAndPassword: AccountAndPassword = {
            email: fields.email,
            userId: userId,
            userName: fields.username,
            profileId: userProfileId,
            firstName: fields.firstName,
            lastName: fields.lastName,
            imageUrl: 'TBD',
            PASSWORD: fields.password,
        };
        
        return await accountRepository.createAccount(accountAndPassword);
    },

    /**
     * Checks if an account with the provided email and username is available.
     * Throws an error if either is already taken.
     *
     * @param email - The email to check.
     * @param username - The username to check.
     * @throws A 400 error if the email or username is already tied to an account.
     */
    checkAccountAvailable: async (email: UserAttributes["email"], username: UserAttributes["userName"]): Promise<void> => {
        // Check if the email is available
        if (!(await userRepository.isEmailAvailable(email))) {
            logger.debug(`${email} is unavailable`)
            throw errorFactory(EMAIL_UNAVAILABLE);
        }

        // Check if the username is available
        if (!(await userRepository.isUsernameAvailable(username))) {
            logger.debug(`${username} is unavailable`)
            throw errorFactory(USERNAME_UNAVAILABLE);
        }
    },

    /**
     * Retrieves an account by email.
     *
     * @param email - The email of the account to retrieve.
     * @returns A promise that resolves to the account details.
     */
    getAccountByEmail: async (email: UserAttributes["email"]): Promise<Account> => {
        const account: UserIncludeProfile = await accountRepository.getAccountByEmail(email);

        const formattedAccount : Account = {
            userId: account.userId,
            userName: account.userName,
            profileId: account.profileId,
            email: account.email,
            firstName: account.profile.firstName,
            lastName: account.profile.lastName,
            imageUrl: account.profile.imageUrl
        }

        return formattedAccount;
    },
};

export default accountService;