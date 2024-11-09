import { v4 as uuidv4 } from 'uuid';
import { SignupRequestFields } from '../../types/auth/authTypes';
import accountRepository, { AccountAndPasswordAttributes, AccountAttributes } from '../../repositories/accountRepository';
import userRepository from '../../repositories/userRepository';
import errorFactory from '../../utils/errors/errorFactory';
import { UserAttributes } from '../../models/User';

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
    createAccount: async (fields: SignupRequestFields): Promise<AccountAttributes> => {
        // Check if the account with the given email and username is available
        await accountService.checkAccountAvailable(fields.email, fields.username);

        // Generate UUIDs for user profile and user ID
        const userProfileId = uuidv4();
        const userId = uuidv4();

        const accountAndPassword: AccountAndPasswordAttributes = {
            USER_EMAIL: fields.email,
            USER_ID: userId,
            USER_NAME: fields.username,
            USER_PROFILE: {
                PROFILE_ID: userProfileId,
                FIRST_NAME: fields.firstName,
                LAST_NAME: fields.lastName,
                IMAGE_URL: 'TODO', // Placeholder for image URL
            },
            PASSWORD: fields.password,
        };

        // Create the account record
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
    checkAccountAvailable: async (email: UserAttributes["USER_EMAIL"], username: UserAttributes["USER_NAME"]): Promise<void> => {
        // Check if the email is available
        if (!(await userRepository.isEmailAvailable(email))) {
            throw errorFactory({
                message: 'Email already tied to account',
                statusCode: 400,
            });
        }

        // Check if the username is available
        if (!(await userRepository.isUsernameAvailable(username))) {
            throw errorFactory({
                message: 'Username already tied to account',
                statusCode: 400,
            });
        }
    },

    /**
     * Retrieves an account by email.
     *
     * @param email - The email of the account to retrieve.
     * @returns A promise that resolves to the account details.
     */
    getAccountByEmail: async (email: UserAttributes["USER_EMAIL"]): Promise<AccountAttributes> => {
        return await accountRepository.getAccountByEmail(email);
    },
};

export default accountService;