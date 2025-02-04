import profileRepository from '../../repositories/profileRepository';
import { ProfileSearchParams } from '../../controllers/profile/profileController';
import { Pagination, ProfileAndLeagueInviteStatus } from '../../generated-api';

const profileService = {
  searchForProfilesToInviteToLeague: async (
    params: ProfileSearchParams
  ): Promise<{ profiles: ProfileAndLeagueInviteStatus[]; pagination: Pagination }> => {
    const { foundProfiles, totalCount } = await profileRepository.profileSearchQuery(params);
    const totalPages = Math.ceil(totalCount / params.limit);

    const pagination: Pagination = {
      currentPage: params.page,
      totalPages,
      totalCount,
    };

    return {
      profiles: foundProfiles,
      pagination,
    };
  },
};

export default profileService;
