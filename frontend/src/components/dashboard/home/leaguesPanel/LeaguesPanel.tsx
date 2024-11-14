import React, { useEffect, useState } from "react";
import { League } from "../../../../../generated-api";
import AddCircleIcon from "../../../../assets/add_circle.svg";
import CreateLeagueForm from "./forms/CreateLeagueForm";
import LeagueList from "./LeagueList";

const LeaguesPanel: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isCreateLeagueFormVisible, setIsCreateLeagueFormVisible] = useState(false);

  // Fetch leagues when the component mounts
  useEffect(() => {
    // TODO: Fetch leagues for the user's profile
  }, []); // Empty dependency array ensures it runs only once after mount

  const handleCreateLeagueClick = (): void => {
    setIsCreateLeagueFormVisible(true);
  };

  const renderNoLeaguesMessage = () => (
    <div className="text-center py-8">
      <h3 className="text-xl text-gray-600 mb-2">
        You are currently not enrolled in any leagues.
      </h3>
      <button
        onClick={handleCreateLeagueClick}
        className="bg-blue-500 text-white font-semibold py-2 px-6 mb-4 rounded-md hover:bg-blue-600 transition duration-300 shadow-md transform hover:scale-105"
      >
        Create a League
      </button>
    </div>
  );

  const renderCreateLeagueForm = () => (
    <CreateLeagueForm
      setShowCreateLeagueForm={setIsCreateLeagueFormVisible}
      setLeagues={setLeagues}
      leagues={leagues}
    />
  );

  const renderContent = () => {
    if (leagues.length > 0) {
      return <LeagueList leagues={leagues} />;
    }
    if (!isCreateLeagueFormVisible) {
      return renderNoLeaguesMessage();
    }
  };

  return (
    <div className="mx-auto bg-white p-8 rounded-lg shadow-lg w-auto">
      <div className="flex justify-between items-center" id="panelHeader">
        <h2 className="text-2xl font-semibold text-gray-700">Your Leagues</h2>
          <div
            onClick={handleCreateLeagueClick}
            className="cursor-pointer p-2 transition duration-300 transform hover:scale-105 hover:bg-blue-200 active:bg-blue-400 rounded-full"
            aria-label="Create League"
          >
            <img
              src={AddCircleIcon}
              alt="Create League"
              className="w-6 h-6 transition-colors duration-300"
            />
          </div>
      </div>

      <hr className="border-t border-gray-200 mb-3" />

      <div>{renderContent()}</div>
      {isCreateLeagueFormVisible && renderCreateLeagueForm()}
    </div>
  );
};

export default LeaguesPanel;
