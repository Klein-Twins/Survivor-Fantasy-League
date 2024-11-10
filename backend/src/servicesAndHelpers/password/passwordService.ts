import { Transaction } from 'sequelize';
import { PasswordAttributes } from '../../models/Password';
import { UserAttributes } from '../../models/User';
import { AccountAndPasswordAttributes } from '../../repositories/accountRepository';
import passwordRepository from '../../repositories/passwordRepository';
import errorFactory from '../../utils/errors/errorFactory';
import passwordHelper from './passwordHelper';
import logger from '../../config/logger';
import { INTERNAL_SERVER_ERROR, PLEASE_RESET_PASSWORD, WEAK_PASSWORD_ERROR } from '../../constants/auth/responseErrorConstants';

/**
 * Service functions related to password management, including creating passwords, 
 * checking passwords, and ensuring password security.
 */
const passwordService = {

    /**
     * Creates a hashed password for a given account, ensuring the password is strong.
     * 
     * @param accountAndPassword - The account and password details.
     * @param transaction - The Sequelize transaction for DB consistency.
     * @returns A promise that resolves to the created password object.
     * @throws A 400 error if the password is weak, or a 500 error if hashing fails.
     */
    createPasswordForAccount: async (
        accountAndPassword: AccountAndPasswordAttributes,
        transaction: Transaction
    ): Promise<PasswordAttributes> => {
        // Ensure password strength before proceeding
        if (!passwordHelper.isPasswordStrong(accountAndPassword.PASSWORD)) {
            throw errorFactory(WEAK_PASSWORD_ERROR);
        }

        // Hash the password
        const hashedPassword = await passwordHelper.getHashedPassword(accountAndPassword.PASSWORD);
        if (!hashedPassword) {
            logger.error(`Failed to hash password: ${accountAndPassword.PASSWORD}`)
            throw errorFactory(INTERNAL_SERVER_ERROR);
        }

        // Store the hashed password
        return await passwordRepository.createPasswordForUserId(
            accountAndPassword.USER_ID,
            hashedPassword,
            transaction
        );
    },

    /**
     * Compares a plain-text password against the stored password for a user.
     * 
     * @param user - The user record containing the user details.
     * @param password - The plain-text password to check.
     * @returns A promise that resolves to `true` if the passwords match, otherwise `false`.
     * @throws A 500 error if no active password is found for the user.
     */
    checkPasswordAgainstUserPassword: async (
        user: UserAttributes,
        password: string
    ): Promise<boolean> => {
        // Retrieve the active password for the user
        const activePassword = await passwordRepository.getActivePasswordForUserId(user.USER_ID);

        if (!activePassword) {
            logger.error(`No active password for user ${user.USER_ID} found...`);
            throw errorFactory(PLEASE_RESET_PASSWORD);
        }

        // Compare the provided password with the stored password
        return await passwordHelper.doPasswordsMatch(password, activePassword.PASSWORD);
    }
};

export default passwordService;