import { Model, Transaction } from 'sequelize';
import { ProfileAttributes } from '../../models/Profile';
import profileRepository from '../../repositories/profileRepository';
import { AccountAndPassword } from '../../types/auth/authTypes';
import { ProfileSearchParams, ProfileSearchResultsWithPagination } from '../../types/profile/profileTypes';
import errorFactory from '../../utils/errors/errorFactory';
import logger from '../../config/logger';

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
            imageUrl: accountAndPassword.profileImageUrl,
            firstName: accountAndPassword.firstName,
            lastName: accountAndPassword.lastName,
        };

        // Create the profile record in the database
        return await profileRepository.createProfileRecord(profileRecordCreationInput, transaction);
    },

    searchForProfilesToInviteToLeague: async (params: ProfileSearchParams): Promise<ProfileSearchResultsWithPagination> => {

        const { userName, firstName, lastName } = params;
        if (!userName && !firstName && !lastName) {
            throw errorFactory({ error: "Username, first name, or last name required for search.", statusCode: 400 })
        }

        const profileSearchResults = await profileRepository.getProfilesBySearchForLeagueInvites(params);
        const totalPages = Math.ceil(profileSearchResults.totalCount / params.limit);

        return {
            searchResults: profileSearchResults.foundProfiles,
            pagination: {
                totalPages,
                totalCount: profileSearchResults.totalCount,
                currentPage: params.page,
            }
        }

    }
};

export default profileService;