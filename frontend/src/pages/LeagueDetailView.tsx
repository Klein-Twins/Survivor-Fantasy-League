import React, { } from "react";
import { useLocation } from "react-router-dom";
import LeagueMembersPanel from "../components/leagues/LeagueMembersPanel";

const LeagueDetailView: React.FC = () => {
  const location = useLocation();

  const { leagueId } = location.state

  //Handle if he user enters the URL manually.
  if (!leagueId) return <h1>You cannot navigate here this way</h1>

  return (
    <div className="min-h-screen">
      <LeagueMembersPanel leagueId={leagueId} />
    </div>
  );
}

export default LeagueDetailView;