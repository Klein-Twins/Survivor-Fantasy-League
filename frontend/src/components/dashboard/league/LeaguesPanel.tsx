import React, { useEffect, useState } from "react";
import LeagueList from "./LeagueList";
import AddCircleIcon from "../../../assets/add_circle.svg";
import CreateLeagueForm from "./forms/CreateLeagueForm";

const LeaguesPanel: React.FC = () => {
  const [leagues, setLeagues] = useState([]);
  const [showCreateLeagueForm, setShowCreateLeagueForm] = useState(false);

  useEffect(() => {
    // TODO: Implement Profile service call to fetch leagues for profile
  }, []); // Add dependency array to avoid infinite re-renders

  const onClickCreateLeague = (): void => {
    setShowCreateLeagueForm(true);
  };

  const renderNoLeaguesMessage = () => (
    <div className="text-center py-8">
      <h3 className="text-xl text-gray-600 mb-2">
        You are currently not enrolled in any leagues.
      </h3>
      <button
        onClick={onClickCreateLeague}
        className="bg-blue-500 text-white font-semibold py-2 px-6 mb-4 rounded-md hover:bg-blue-600 transition duration-300 shadow-md transform hover:scale-105"
      >
        Create a League
      </button>
    </div>
  );

  const renderCreateLeagueForm = () => (
    <>
      <CreateLeagueForm setShowCreateLeagueForm={setShowCreateLeagueForm} />
    </>
  );

  return (
    <div className="mx-auto bg-white p-3 rounded-lg shadow-lg max-w-4xl">
      <div className="flex justify-between items-center mb-3" id="panelHeader">
        <h2 className="text-2xl font-semibold text-gray-700">Your Leagues</h2>
        {(leagues && !showCreateLeagueForm) ?? (
          <div
            onClick={onClickCreateLeague}
            className="cursor-pointer p-2 transition duration-300 transform hover:scale-105 hover:bg-blue-200 active:bg-blue-400 rounded-full"
            aria-label="Create League"
          >
            <img
              src={AddCircleIcon}
              alt="Create League"
              className="w-6 h-6 transition-colors duration-300"
            />
          </div>
        )}
      </div>

      <hr className="border-t border-gray-200 mb-3" />

      {/* Conditional Render Based on Leagues */}
      <div>
        {leagues?.length > 0 ? (
          <LeagueList leagues={leagues} />
        ) : showCreateLeagueForm ? (
          renderCreateLeagueForm()
        ) : (
          renderNoLeaguesMessage()
        )}
      </div>
    </div>
  );
};

export default LeaguesPanel;
