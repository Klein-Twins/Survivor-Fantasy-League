import React, { } from "react";
import { League as LeagueModel } from "../../generated-api";
import { useLocation } from "react-router-dom";

const LeagueDetailView: React.FC = () => {
  const location = useLocation();

  const leagueID = location.state as { leagueId: LeagueModel };

  //Handle if he user enters the URL manually.
  if (!leagueID) return <h1>You cannot navigate here this way</h1>

  return <h1>{leagueID.leagueId.leagueId}</h1>;
}

export default LeagueDetailView;