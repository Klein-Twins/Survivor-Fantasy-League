import React from "react";
import { League as LeagueModel } from "../../../../generated-api";
import { useParams } from "react-router-dom";

interface LeagueProps {
    league: LeagueModel;
  }

const League: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    return <div>LEAGUE VIEW</div>
}

export default League