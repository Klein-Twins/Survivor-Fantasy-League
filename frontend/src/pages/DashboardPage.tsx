import React, { useEffect, useState } from "react";
import LeaguesPanel from "../components/dashboard/home/leaguesPanel/LeaguesPanel";
import { GetLeaguesForProfileResponse, League } from "../../generated-api";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { AxiosResponse } from "axios";
import leagueService from "../services/league/leagueService";

const DashboardPage: React.FC = () => {

  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const account = useSelector((state: RootState) => state.auth.account);

  if (!account) {
    return <div>Please log in</div>
  }

  useEffect(() => {
    const getLeagues = async () => {
      setIsLoading(true);
      setError(undefined);
      try {
        const response: AxiosResponse<GetLeaguesForProfileResponse> = await leagueService.getLeaguesForProfile(account.profileId);
        setLeagues(response.data.leagues!);
      } catch (error) {
        setError(error as Error);
      }
      setIsLoading(false);
    }
    getLeagues();
  }, [])

  return (
    <div className="max-w-8xl mx-auto px-8">
      <h3 className="text-3xl font-semibold text-gray-800 mb-6">
        Hello Michael, welcome to your dashboard!
      </h3>
      <LeaguesPanel />
    </div>
  );
}

export default DashboardPage;