import { Transaction } from 'sequelize';
import { ProfileAttributes } from '../../models/Profile';
import profileRepository from '../../repositories/profileRepository';
import { AccountAndPassword } from '../../types/auth/authTypes';
import { LeagueProfileAttributes } from '../../models/LeagueProfile';

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
        accountAndPassword: AccountAndPassword,
        transaction: Transaction
    ): Promise<ProfileAttributes> => {
        
        const profileRecordCreationInput: ProfileAttributes = {
            profileId: accountAndPassword.profileId,
            imageUrl: accountAndPassword.imageUrl,
            firstName: accountAndPassword.firstName,
            lastName: accountAndPassword.lastName,
        };

        // Create the profile record in the database
        return await profileRepository.createProfileRecord(profileRecordCreationInput, transaction);
    }
};

export default profileService;