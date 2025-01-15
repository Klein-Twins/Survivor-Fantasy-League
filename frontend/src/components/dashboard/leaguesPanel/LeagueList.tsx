import React from "react";
import LeagueListEntry from "./LeagueListEntry";
import { ProfileLeaguesResponseSuccessSchemaLeagues } from "../../../../generated-api";

interface LeagueListProps {
  leagues: ProfileLeaguesResponseSuccessSchemaLeagues[]; // Replace with League[] type
}

const LeagueList: React.FC<LeagueListProps> = ({ leagues }) => {
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {leagues.map((league: ProfileLeaguesResponseSuccessSchemaLeagues) => (
        <LeagueListEntry league={league} key={league.leagueId} />
      ))}
    </div>
  );
};

export default LeagueList;
