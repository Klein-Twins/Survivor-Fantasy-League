import { Transaction } from 'sequelize';
import { ProfileAttributes } from '../../models/Profile';
import { AccountAndPasswordAttributes } from '../../repositories/accountRepository';
import profileRepository from '../../repositories/profileRepository';

/**
 * Service functions related to profile management, including creating profiles for accounts.
 */
const profileService = {

    /**
     * Creates a profile record for a given account, using account and profile information.
     * 
     * @param accountAndPassword - The account and password details containing profile information.
     * @param transaction - The Sequelize transaction to maintain database consistency.
     * @returns A promise that resolves to the created profile record.
     */
    createProfileForAccount: async (
        accountAndPassword: AccountAndPasswordAttributes,
        transaction: Transaction
    ): Promise<ProfileAttributes> => {
        // Prepare the profile record to be created
        const profileRecordCreationInput: ProfileAttributes = {
            PROFILE_ID: accountAndPassword.USER_PROFILE.PROFILE_ID,
            IMAGE_URL: accountAndPassword.USER_PROFILE.IMAGE_URL,
            FIRST_NAME: accountAndPassword.USER_PROFILE.FIRST_NAME,
            LAST_NAME: accountAndPassword.USER_PROFILE.LAST_NAME,
        };

        // Create the profile record in the database
        return await profileRepository.createProfileRecord(profileRecordCreationInput, transaction);
    }
};

export default profileService;