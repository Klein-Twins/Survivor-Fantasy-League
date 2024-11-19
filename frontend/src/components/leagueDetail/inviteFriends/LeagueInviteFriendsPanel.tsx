import ProfileSearchForm from "./searchForm/ProfileSearchForm";
import ProfileSearchResults from "./searchResults/ProfileSearchResultsList";
import PageBar from "./searchResults/PageBar";
import useLeagueInviteSearch from "../../../hooks/league/useLeagueInviteSearch";

interface InviteFriendsToLeagueSearchProps {
    leagueId: string
}

const LeagueInviteFriendsPanel: React.FC<InviteFriendsToLeagueSearchProps> = ({ leagueId }) => {
    const { data, isLoading, error, handleSearchSubmit, handlePageChange } = useLeagueInviteSearch(leagueId);

    return (
        <>
            <ProfileSearchForm onSearchSubmit={handleSearchSubmit} />
            {isLoading && <div>Loading...</div>}
            {error && <div>Error occurred while fetching profiles</div>}

            {data && data.foundResults && (
                <>
                    <ProfileSearchResults profiles={data.results.searchResults} />
                    {data.results.pagination.totalPages > 1 && (
                        <PageBar onPageChange={handlePageChange} pagination={data.results.pagination} />
                    )}
                </>
            )}
            {data && !data.foundResults && <div>No profiles found</div>}
            {!data && !isLoading && <div>Search for your friends!</div>}
        </>
    );
};

export default LeagueInviteFriendsPanel;