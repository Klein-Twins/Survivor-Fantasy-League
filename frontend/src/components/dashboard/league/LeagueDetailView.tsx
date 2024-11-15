import React, { } from "react";
import { League as LeagueModel } from "../../../../generated-api";
import { useLocation } from "react-router-dom";

const LeagueDetailView: React.FC = () => {
  const location = useLocation();

  const leagueID = location.state as { leagueId: LeagueModel };

  return <h1>{leagueID.leagueId.leagueId}</h1>;
}

export default LeagueDetailView;