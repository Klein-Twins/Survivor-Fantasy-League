import React from "react";
import LeagueListEntry from "./LeagueListEntry";
import test from "../../../../../generated-api/index";

interface LeagueListProps {
  leagues: any[]; // Replace with League[] type
}

const LeagueList: React.FC<LeagueListProps> = ({ leagues }) => {
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {leagues.map((league) => (
        <LeagueListEntry league={league} key={league.id} />
      ))}
    </div>
  );
};

export default LeagueList;
