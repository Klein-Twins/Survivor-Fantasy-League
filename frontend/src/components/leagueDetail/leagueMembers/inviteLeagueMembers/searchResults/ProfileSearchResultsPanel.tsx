import React from "react";
import { Pagination, ProfileSearchResults as ProfileSearchResultsType } from "../../../../../services/profile/profileService";
import ProfileSearchResultsDisplay from "./ProfileSearchResultsDisplay";

interface ProfileSearchResultsPanelProps {
    isLoading: boolean;
    error?: string | null;
    message?: string;
    foundResults?: boolean;
    profiles?: ProfileSearchResultsType;
    pagination?: Pagination;
    onPageChange: (value: number) => void;
}

const ProfileSearchResultsPanel: React.FC<ProfileSearchResultsPanelProps> = ({ isLoading, error, message, foundResults, profiles, pagination, onPageChange }) => {

    if (isLoading) {
        return (
            <div className="flex w-full h-14 bg-blue-200 rounded-lg items-center justify-center">
                <h2 className="font-semibold text-lg my-auto text-black">Loading...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex w-full h-14 bg-red-200 rounded-lg items-center justify-center">
                <h2 className="font-semibold text-lg my-auto text-red-500">{error}</h2>
            </div>
        );
    }

    if (!foundResults && message) {
        return (
            <div className="flex w-full h-14 bg-blue-200 rounded-lg items-center justify-center">
                <h2 className="font-semibold text-lg my-auto text-black">{message}</h2>
            </div>
        );
    }

    if (!foundResults) {
        return (
            <div className="flex w-full h-14 bg-blue-200 rounded-lg items-center justify-center">
                <h2 className="font-semibold text-lg my-auto text-black">Search to invite your friends!</h2>
            </div>
        );
    }

    return <ProfileSearchResultsDisplay profiles={profiles} pagination={pagination} onPageChange={onPageChange} />;
}

export default ProfileSearchResultsPanel;