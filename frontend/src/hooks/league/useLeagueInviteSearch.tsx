import { useCallback, useState } from 'react';
import { useApi } from '../useApi';
import ProfileSearchService, {
  GetProfilesBySearchRequestParams,
} from '../../services/league/invite/search/ProfileSearchService';
import { LeagueInviteProfileSearchResponse } from '../../../generated-api';

// interface ProfileSearchFormValues {
//   firstName?: string;
//   lastName?: string;
//   userName?: string;
//   sortBy?: string;
//   numProfilesPerPage: number;
//   isAsc: boolean;
// }

const useLeagueInviteSearch = (leagueId: string, profileId: string) => {
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);

  // Define default values for search form
  const [searchFormValues, setSearchFormValues] =
    useState<GetProfilesBySearchRequestParams>({
      firstName: undefined,
      lastName: undefined,
      userName: undefined,
      leagueId: leagueId,
      sortBy: undefined,
      isAsc: true,
      limit: 10,
    });

  // Hook call with proper types for API function and params
  const {
    data: responseData,
    isLoading,
    error,
    execute: fetchData,
  } = useApi<
    void,
    GetProfilesBySearchRequestParams,
    LeagueInviteProfileSearchResponse
  >(ProfileSearchService.search);

  // Handle the search form submission
  const handleSearchSubmit = useCallback(
    (values: GetProfilesBySearchRequestParams) => {
      setSearchFormValues(values); // Update form state
      setCurrentPageNumber(1); // Reset to the first page
      fetchData({
        queryParams: {
          userName: values.userName,
          firstName: values.firstName,
          lastName: values.lastName,
          leagueId: leagueId,
          page: 1,
          limit: values.limit,
          sortBy: values.sortBy,
          isAsc: values.isAsc,
        },
      });
    },
    [fetchData, leagueId, profileId]
  );

  // Handle page changes for pagination
  const handlePageChange = useCallback(
    (pageNumber: number) => {
      setCurrentPageNumber(pageNumber); // Update current page
      fetchData({
        queryParams: {
          ...searchFormValues,
          limit: searchFormValues.limit,
          page: pageNumber,
          leagueId, // Add leagueId to params
          //profileId, // Add profileId to params
        },
      });
    },
    [fetchData, leagueId, profileId, searchFormValues]
  );

  return {
    responseData,
    isLoading,
    error,
    handleSearchSubmit,
    handlePageChange,
  };
};

export default useLeagueInviteSearch;
