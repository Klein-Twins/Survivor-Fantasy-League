import ProfileSearchForm from "./searchForm/ProfileSearchForm";
import useLeagueInviteSearch from "../../../../hooks/league/useLeagueInviteSearch";
import ProfileSearchResultsPanel from "./searchResults/ProfileSearchResultsPanel";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";

interface InviteLeagueMembersPanelProps {
    leagueId: string
    profileId: string
}

const InviteLeagueMembersPanel: React.FC<InviteLeagueMembersPanelProps> = ({ leagueId, profileId }) => {
    const { responseData, isLoading, error, handleSearchSubmit, handlePageChange } = useLeagueInviteSearch(leagueId, profileId);
    return (
        <div className="w-3/4 mx-auto bg-blue-100 rounded-md p-6">
            <div className="w-full mx-auto bg-blue-200 rounded-md p-6">
                <ProfileSearchForm onSearchSubmit={handleSearchSubmit} leagueId={leagueId} profileId={profileId} />
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