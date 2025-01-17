import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddCircleIcon from "../../../assets/add_circle.svg";
import leagueService from "../../../services/league/leagueService";
import { RootState } from "../../../store/store";
import LeagueList from "./LeagueList";
import useGetApi from "../../../hooks/useGetApi";
import NoLeagues from "./NoLeagues";
import CreateLeagueForm from "./forms/CreateNewLeagueForm";
import { League } from "../../../../generated-api";




const LeaguesPanel: React.FC = () => {

  const [showCreateLeagueForm, setShowCreateLeagueForm] = useState(false);
  const account = useSelector((state: RootState) => state.auth.account);
  const profileId = account?.profileId || "";

  const { responseData, isLoading, error, fetchData } = useGetApi(() =>
    leagueService.getLeaguesForProfile(profileId)
  );

  const leagues: League[] = (responseData && responseData?.leagues) ? responseData.leagues : []
  console.log(leagues);


  useEffect(() => {
    if (profileId && !showCreateLeagueForm) {
      fetchData(); // Fetch leagues when profileId is set
    }
  }, [profileId, showCreateLeagueForm]);

  if (error) return <p>Error: {error}</p>;


  return (
    <div className="flex flex-col mx-auto bg-white p-8 rounded-lg shadow-lg w-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">{isLoading && leagues.length == 0 ? "Loading Your Leagues" : "Your Leagues"}</h2>
        <div
          className="cursor-pointer p-2 transition duration-300 -translate-y-2 transform hover:scale-105 hover:bg-blue-200 active:bg-blue-400 rounded-full"
          aria-label="Create League"
        >
          <img
            src={AddCircleIcon}
            onClick={() => setShowCreateLeagueForm(true)}  // Open the form when clicked
            alt="Create League"
            className="w-6 h-6 transition-colors duration-300"
          />
        </div>
      </div>
      <hr className="border-t border-gray-200 mb-3" />

      {showCreateLeagueForm && (
        <>
          <CreateLeagueForm
            setShowCreateLeagueForm={setShowCreateLeagueForm}
            setLeagues={() => { }}  // You can handle setting leagues here as well if needed
            leagues={leagues}
          />
          {leagues.length !== 0 && <hr className="border-t border-gray-200 mt-3 mb-3" />}
        </>
      )}

      {leagues.length === 0 && !showCreateLeagueForm && !isLoading && <NoLeagues onClickAddForm={setShowCreateLeagueForm} />}
      {leagues.length !== 0 && <LeagueList leagues={leagues} />}
    </div>
  );
};

export default LeaguesPanel;