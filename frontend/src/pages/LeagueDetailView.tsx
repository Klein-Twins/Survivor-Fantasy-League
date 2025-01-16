import React from "react";
import { useLocation } from "react-router-dom";
import LeagueMembersPanel from "../components/leagues/LeagueMembersPanel";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { LeagueProvider } from "../components/leagueDetail/LeagueContext";

const LeagueDetailView: React.FC = () => {
  const location = useLocation();
  const { leagueId } = location.state;
  const account = useSelector((state: RootState) => state.auth.account);

  if (!account || !account.profileId) {
    return <h1>Please relog in to the application.</h1>;
  }
  if (!leagueId) return <h1>You cannot navigate here this way</h1>;

  return (
    <LeagueProvider leagueId={leagueId} profileId={account.profileId}>
      <div className="min-h-screen">
        <LeagueMembersPanel />
      </div>
    </LeagueProvider>
  );
};

export default LeagueDetailView;