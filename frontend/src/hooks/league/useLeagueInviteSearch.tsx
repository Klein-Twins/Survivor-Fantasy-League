import { useCallback, useState } from "react";
import profileService, { GetProfilesBySearchRequestData, ProfileSearchFormValues } from "../../services/profile/profileService";
import { useApi } from "../useApi";
import { SearchProfilesForLeagueInviteResponse } from "../../../generated-api";


const useLeagueInviteSearch = (leagueId: string, profileId: string) => {
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);

    // Define default values for search form
    const [searchFormValues, setSearchFormValues] = useState<ProfileSearchFormValues>({
        firstName: undefined,
        lastName: undefined,
        userName: undefined,
        sortBy: undefined,
        isAsc: true,
        numProfilesPerPage: 10,
    });

    // Hook call with proper types for API function and params
    const { data:responseData, isLoading, error, execute:fetchData } = useApi<void, GetProfilesBySearchRequestData, SearchProfilesForLeagueInviteResponse>(
        profileService.getProfilesBySearch
    );

    // Handle the search form submission
    const handleSearchSubmit = useCallback(
        (values: ProfileSearchFormValues) => {
            setSearchFormValues(values); // Update form state
            setCurrentPageNumber(1); // Reset to the first page
            fetchData(
                {
                    queryParams: {
                        userName: values.userName,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        leagueId: leagueId,
                        page: 1,
                        limit: values.numProfilesPerPage,
                        sortBy: values.sortBy,
                        isAsc: values.isAsc,
                    }
                }
            );
        },
        [fetchData, leagueId, profileId]
    );

    // Handle page changes for pagination
    const handlePageChange = useCallback(
        (pageNumber: number) => {
            setCurrentPageNumber(pageNumber); // Update current page
            fetchData({queryParams:{
                ...searchFormValues,
                limit: searchFormValues.numProfilesPerPage,
                page: pageNumber,
                leagueId, // Add leagueId to params
                //profileId, // Add profileId to params
        }});
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