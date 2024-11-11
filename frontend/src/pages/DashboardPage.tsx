import { useEffect, useState } from "react";
import LeagueList from "../components/dashboard/league/LeagueList";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { openModal } from "../store/slices/modalSlice";

function DashboardPage() {
  const [leagues, setLeagues] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    // TODO: Implement Profile service call to fetch leagues for profile
  });

  const onClickCreateLeague = () : void => {
    dispatch(openModal({ type: 'createLeague' }));

  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6">
          Hello Michael, welcome to your dashboard!
        </h3>

        <div className="mx-auto bg-white p-8 rounded-lg shadow-lg">
          {leagues && leagues.length > 0 ? (
            <div>
              <h4 className="text-2xl font-medium text-gray-700 mb-4">
                Your Active Leagues
              </h4>
              <LeagueList leagues={leagues} />
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl text-gray-600 mb-4">
                You are currently not enrolled in any leagues.
              </h2>
              <button
                onClick={onClickCreateLeague}
                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Create a League
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
