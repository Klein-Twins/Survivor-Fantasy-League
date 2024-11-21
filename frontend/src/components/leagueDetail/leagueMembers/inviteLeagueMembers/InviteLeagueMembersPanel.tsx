import ProfileSearchForm from "./searchForm/ProfileSearchForm";
import useLeagueInviteSearch from "../../../../hooks/league/useLeagueInviteSearch";
import ProfileSearchResultsPanel from "./searchResults/ProfileSearchResultsPanel";

interface InviteLeagueMembersPanelProps {
    leagueId: string
}

const InviteLeagueMembersPanel: React.FC<InviteLeagueMembersPanelProps> = ({ leagueId }) => {
    const { data, isLoading, error, handleSearchSubmit, handlePageChange } = useLeagueInviteSearch(leagueId);

    return (
        <div className="w-3/4 mx-auto bg-blue-100 rounded-md p-6">
            <div className="w-full mx-auto bg-blue-200 rounded-md p-6">
                <ProfileSearchForm onSearchSubmit={handleSearchSubmit} />
                <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <ProfileSearchResultsPanel
                    isLoading={isLoading}
                    error={error}
                    message={data?.message}
                    foundResults={data?.foundResults}
                    profiles={data?.results?.searchResults}
                    pagination={data?.results?.pagination}
                    onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default InviteLeagueMembersPanel;