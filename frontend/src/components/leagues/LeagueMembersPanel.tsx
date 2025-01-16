import { Button } from "@headlessui/react";
import React, { useState } from "react";
import InviteFriendsToLeagueSearch from "../leagueDetail/leagueMembers/inviteLeagueMembers/InviteLeagueMembersPanel";

const LeagueMembersPanel: React.FC = () => {
    const [showInviteFriendsBySearch, setShowInviteFriendsBySearch] = useState<boolean>(false);

    const handleInviteFriendsClick = () => {
        setShowInviteFriendsBySearch(!showInviteFriendsBySearch);
    }

    return (
        <div className="w-full p-2">
            <div className="text-center">
                <div>Current League Members</div>
                <div><Button onClick={handleInviteFriendsClick} className="rounded bg-sky-600 py-2 px-4 text-sm w-1/2 text-white data-[hover]:bg-sky-500 data-[hover]:data-[active]:bg-sky-700">Invite Friends!</Button></div>


                {showInviteFriendsBySearch && <InviteFriendsToLeagueSearch />}
            </div>
        </div>
    );
}


export default LeagueMembersPanel;