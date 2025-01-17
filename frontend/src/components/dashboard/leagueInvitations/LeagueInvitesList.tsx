import React from "react";
import { LeagueInvite as LeagueInviteSchema } from "../../../../generated-api";
import LeagueInvite from "./LeagueInvite";

interface LeagueInvitesListProps {
    leagueInvites: LeagueInviteSchema[]
    onRemoveInvite: (leagueId: string) => void;
}

const LeagueInvitesList: React.FC<LeagueInvitesListProps> = ({ leagueInvites, onRemoveInvite }) => {
    return (
        <div className="flex flex-col space-y-2 w-full">
            {
                leagueInvites.map((leagueInvite) => (
                    <div className="flex flex-col space-y-2 w-full">
                        <LeagueInvite key={Math.random()} leagueInvite={leagueInvite} onRemoveInvite={onRemoveInvite} />
                    </div>
                ))
            }
        </div>
    );
};

export default LeagueInvitesList;