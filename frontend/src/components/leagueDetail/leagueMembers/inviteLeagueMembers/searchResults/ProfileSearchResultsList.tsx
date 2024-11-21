import React, { useState } from "react";
import { GetProfilesBySearchResponse, ProfileSearchResults } from "../../../../../services/profile/profileService";
import { Button } from "@headlessui/react";

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
                            {profiles.map((profile) => (
                                <div key={profile.profileId} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex flex-row justify-start items-center">
                                        <h3 className="text-left text-xl w-36  font-semibold">{profile.userName}</h3>
                                        <h4 className="text-lg">{joinStrings(profile.firstName, profile.lastName)}</h4>
                                    </div>
                                    <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">Send Invite</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )
                :
                (<div>No profiles found</div>)}
        </>
    );
}

const joinStrings = (str1: string | null | undefined, str2: string | null | undefined): string =>
    [str1, str2].filter((s): s is string => Boolean(s)).join(' ');

export default ProfileSearchResultsList;