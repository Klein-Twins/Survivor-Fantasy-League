import React from "react";
import { LeagueInvite as LeagueInviteSchema } from "../../../../generated-api";
import LeagueInvite from "./LeagueInvite";

interface LeagueInvitesListProps {
    leagueInvites: LeagueInviteSchema[]
}

const LeagueInvitesList: React.FC<LeagueInvitesListProps> = ({ leagueInvites }) => {
    return (
        <div className="flex flex-col space-y-2 w-full">
            {
                leagueInvites.map((leagueInvite) => (
                    <div className="flex flex-col space-y-2 w-full">
                        <LeagueInvite key={Math.random()} leagueInvite={leagueInvite} />
                    </div>
                ))
            }
        </div>
    );
};

export default LeagueInvitesList;