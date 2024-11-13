import React from "react";
import LeaguesPanel from "./leaguesPanel/LeaguesPanel";

const Home: React.FC = () => {
  return (
    <div className="max-w-8xl mx-auto px-8">
      <h3 className="text-3xl font-semibold text-gray-800 mb-6">
        Hello Michael, welcome to your dashboard!
      </h3>
      <LeaguesPanel />
    </div>
  );
};

export default Home;
