import React, { useState } from "react";
import { GetProfilesBySearchResponse, ProfileSearchResults } from "../../../../../services/profile/profileService";
import { Button } from "@headlessui/react";
import ProfileSearchResultItem from "./ProfileSearchResultItem";

interface ProfileSearchResultsProps {
    profiles?: ProfileSearchResults
}

const ProfileSearchResultsList: React.FC<ProfileSearchResultsProps> = ({ profiles }) => {

    if (!profiles) {
        return (
            <div className="flex w-full h-14 bg-red-200 rounded-lg items-center justify-center">
                <h2 className="font-semibold text-lg my-auto text-red-500">Error Rendering profiles in ProfileSearchResultsList</h2>
            </div>
        );
    }

    return (
        <>
            {profiles.length != 0 ?
                (
                    <div className="w-full mx-auto px-4 py-6">
                        <div className="space-y-4">
                            {profiles.map((profileSearchResult) => <ProfileSearchResultItem profileSearchResult={profileSearchResult} />)}
                        </div>
                    </div>
                )
                :
                (<div>No profiles found</div>)}
        </>
    );
}

export default ProfileSearchResultsList;