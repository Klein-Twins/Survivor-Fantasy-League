import { ProfileSearchRequestParams } from '../../controllers/profile/profileSearchController';
import {
  Pagination,
  SearchProfilesForLeagueInviteResponseData,
} from '../../generated-api';
import profileSearchHelper from '../../helpers/profile/profileSearchHelper';
import profileSearchRepository from '../../repositories/profile/profileSearchRepository';
const profileSearchService = {
  getProfilesBySearch,
};

async function getProfilesBySearch({
  searchParamsForQuery,
  paginationInfoForQuery,
  leagueId,
}: ProfileSearchRequestParams): Promise<SearchProfilesForLeagueInviteResponseData> {
  const { foundProfiles, totalCount } =
    await profileSearchRepository.searchForProfilesToInviteToLeague({
      searchParamsForQuery,
      paginationInfoForQuery,
      leagueId,
    });

  const Pagination: Pagination = profileSearchHelper.buildPagination(
    paginationInfoForQuery,
    totalCount
  );

  return {
    profilesFound: foundProfiles,
    pagination: Pagination,
  };
}

export default profileSearchService;
