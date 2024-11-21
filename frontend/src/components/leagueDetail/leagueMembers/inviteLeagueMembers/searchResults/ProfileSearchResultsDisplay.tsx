import React from "react";
import { Pagination, ProfileSearchResults } from "../../../../../services/profile/profileService";
import ProfileSearchResultsList from "./ProfileSearchResultsList";
import PageBar from "./ProfileSearchResultsPageBar";


interface ProfileSearchResultsDisplayProps {
    profiles?: ProfileSearchResults;
    pagination?: Pagination;
    onPageChange: (value: number) => void;
}

const ProfileSearchResultsDisplay: React.FC<ProfileSearchResultsDisplayProps> = ({ profiles, pagination, onPageChange }) => {
    return (
        <div className="flex flex-col space-y-6">
            <ProfileSearchResultsList profiles={profiles} />
            {pagination && pagination.totalPages > 1 && <PageBar pagination={pagination} onPageChange={onPageChange} />}
        </div>
    );
}

export default ProfileSearchResultsDisplay;