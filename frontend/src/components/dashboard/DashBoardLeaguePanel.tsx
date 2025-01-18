import React from "react";
import LeaguesPanel from "./leaguesPanel/LeaguesPanel";
import LeagueInvitesPanel from "./leagueInvitations/LeagueInvitesPanel";

const DashBoardLeaguePanel: React.FC = () => {
    return (
        <>
            <div className="flex mx-auto w-full">
                <div className="w-1/3">
                    <LeagueInvitesPanel className="flex-1 bg-slate-300 rounded-l-lg shadow-sm h-full" />
                </div>
                <div className="w-2/3">
                    <LeaguesPanel className="flex-1 bg-slate-100 rounded-r-lg h-full" />
                </div>
            </div>
        </>
    );
}

export default DashBoardLeaguePanel;