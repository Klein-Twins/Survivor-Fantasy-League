import { Button } from "@headlessui/react";
import { ProfileSearchResult } from "../../../../../services/profile/profileService";
import leagueService from "../../../../../services/league/leagueService";
import { ProfileInviteBody } from "../../../../../../generated-api";
import { useLeagueContext } from "../../../LeagueContext";
import { useState } from "react";

interface ProfileSearchResultItemProps {
    profileSearchResult: ProfileSearchResult;
}

const ProfileSearchResultItem: React.FC<ProfileSearchResultItemProps> = ({ profileSearchResult }) => {

    const [inviteStatus, setInviteStatus] = useState<'pending' | 'accepted' | null>(profileSearchResult.inviteStatus);

    const { leagueId, profileId } = useLeagueContext();
    const handleInviteProfile = async () => {
        setInviteStatus('pending');
        const body: ProfileInviteBody = {
            inviteeProfileId: profileSearchResult.profileId,
            inviterProfileId: profileId,
            leagueId: leagueId
        }
        await leagueService.inviteLeagueMember(body, profileId);
        console.log("Attempted to invite profile: ", profileSearchResult.profileId);
    }

    const EnabledInviteButton = <Button onClick={handleInviteProfile} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">Send Invite</Button>;
    const PendingInviteButton = <Button disabled className="bg-gray-500 text-white px-4 py-2 rounded-md focus:outline-none">Invite Pending</Button>;
    const AlreadyMemberButton = <Button disabled className="bg-gray-500 text-white px-4 py-2 rounded-md focus:outline-none">Already a Member</Button>;

    function getInviteButton(inviteStatus: string | null) {
        if (inviteStatus === "accepted") {
            return AlreadyMemberButton;
        }
        else if (inviteStatus === "pending") {
            return PendingInviteButton;
        }
        else {
            return EnabledInviteButton
        }
    }

    return (
        <div key={profileSearchResult.profileId} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-row justify-start items-center">
                <h3 className="text-left text-xl w-36  font-semibold">{profileSearchResult.userName}</h3>
                <h4 className="text-lg">{joinStrings(profileSearchResult.firstName, profileSearchResult.lastName)}</h4>
            </div>
            {getInviteButton(inviteStatus)}
        </div>
    );
}

const joinStrings = (str1: string | null | undefined, str2: string | null | undefined): string =>
    [str1, str2].filter((s): s is string => Boolean(s)).join(' ');

export default ProfileSearchResultItem;