import { Button } from "@headlessui/react";
import React, { useState } from "react";
import InviteFriendsToLeagueSearch from "../leagueDetail/inviteFriends/LeagueInviteFriendsPanel";

interface LeagueMembersPanelProps {
    leagueId: string;
}

const LeagueMembersPanel: React.FC<LeagueMembersPanelProps> = ({ leagueId }) => {
    const [showInviteFriendsBySearch, setShowInviteFriendsBySearch] = useState<boolean>(false);

    const handleInviteFriendsClick = () => {
        setShowInviteFriendsBySearch(true);
    }

    return (
        <div className="w-full p-2">
            <div className="text-center">
                <div>Current League Members</div>
                <div><Button onClick={handleInviteFriendsClick} className="rounded bg-sky-600 py-2 px-4 text-sm w-full text-white data-[hover]:bg-sky-500 data-[hover]:data-[active]:bg-sky-700">Invite Friends!</Button></div>
                {showInviteFriendsBySearch && <InviteFriendsToLeagueSearch leagueId={leagueId} />}
            </div>
        </div>
    );
}


export default LeagueMembersPanel;