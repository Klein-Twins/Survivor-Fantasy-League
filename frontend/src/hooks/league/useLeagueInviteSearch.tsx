import { useCallback, useState } from "react";
import profileService, { GetProfilesBySearchParams, GetProfilesBySearchResponse, ProfileSearchFormValues } from "../../services/profile/profileService";
import useGetApi from "../useGetApi";

const useLeagueInviteSearch = (leagueId: string) => {
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
    const { data, isLoading, error, fetchData } = useGetApi<GetProfilesBySearchResponse, GetProfilesBySearchParams>(
        profileService.getProfilesBySearch // No type casting needed as the types now align perfectly
    );

    // Handle the search form submission
    const handleSearchSubmit = useCallback(
        (values: ProfileSearchFormValues) => {
            setSearchFormValues(values); // Update form state
            setCurrentPageNumber(1); // Reset to the first page
            fetchData({
                ...values,
                limit: values.numProfilesPerPage,
                page: 1,
                leagueId, // Add leagueId to params
            });
        },
        [fetchData, leagueId]
    );

    // Handle page changes for pagination
    const handlePageChange = useCallback(
        (pageNumber: number) => {
            setCurrentPageNumber(pageNumber); // Update current page
            fetchData({
                ...searchFormValues,
                limit: searchFormValues.numProfilesPerPage,
                page: pageNumber,
                leagueId, // Add leagueId to params
            });
        },
        [fetchData, leagueId, searchFormValues]
    );

    return {
        data,
        isLoading,
        error,
        handleSearchSubmit,
        handlePageChange,
    };
};

export default useLeagueInviteSearch;