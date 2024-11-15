import React, { } from "react";
import { League as LeagueModel } from "../../generated-api";
import { useLocation } from "react-router-dom";

const LeagueDetailView: React.FC = () => {
  const location = useLocation();

  const { leagueId } = location.state

  //Handle if he user enters the URL manually.
  if (!leagueId) return <h1>You cannot navigate here this way</h1>

  return <h1>{leagueId}</h1>;
}

export default LeagueDetailView;