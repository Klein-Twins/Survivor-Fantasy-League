import ProfileSearchForm from "./searchForm/ProfileSearchForm";
import useLeagueInviteSearch from "../../../../hooks/league/useLeagueInviteSearch";
import ProfileSearchResultsPanel from "./searchResults/ProfileSearchResultsPanel";
import { useLeagueContext } from "../../LeagueContext";

const InviteLeagueMembersPanel: React.FC = () => {

    const { leagueId, profileId } = useLeagueContext();

    const { responseData, isLoading, error, handleSearchSubmit, handlePageChange } = useLeagueInviteSearch(leagueId, profileId);
    return (
        <div className="w-3/4 mx-auto bg-blue-100 rounded-md p-6">
            <div className="w-full mx-auto bg-blue-200 rounded-md p-6">
                <ProfileSearchForm onSearchSubmit={handleSearchSubmit} />
                <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <ProfileSearchResultsPanel
                    isLoading={isLoading}
                    error={error}
                    message={responseData?.message}
                    foundResults={responseData?.foundResults}
                    profiles={responseData?.results?.searchResults}
                    pagination={responseData?.results?.pagination}
                    onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default InviteLeagueMembersPanel;