import React, { useEffect } from "react";
import LeaguesPanel from "../components/dashboard/leaguesPanel/LeaguesPanel";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import LeagueInvitesPanel from "../components/dashboard/leagueInvitations/LeagueInvitesPanel";
import DashBoardLeaguePanel from "../components/dashboard/DashBoardLeaguePanel";
import useGetApi from "../hooks/useGetApi";
import { InviteMemberResponse, League, ProfileLeaguesResponse } from "../../generated-api";
import profileService from "../services/profile/profileService";
import leagueService from "../services/league/leagueService";

const DashboardPage: React.FC = () => {
  const account = useSelector((state: RootState) => state.auth.account);
  const profileId = account?.profileId

  if (!account) {
    return <div>Please log in</div>
  }

  const {
    responseData: invitesData,
    isLoading: invitesLoading,
    error: invitesError,
    fetchData: fetchInvites,
    setResponseData: setInvitesData,
  } = useGetApi<InviteMemberResponse, string>((profileId: string) => profileService.getLeagueInvitationsForProfile(profileId));

  const {
    responseData: leaguesData,
    isLoading: leaguesLoading,
    error: leaguesError,
    fetchData: fetchLeagues,
    setResponseData: setLeaguesData,
  } = useGetApi<ProfileLeaguesResponse, string>((profileId: string) => leagueService.getLeaguesForProfile(profileId));

  useEffect(() => {
    if (profileId) {
      fetchInvites(profileId);
      fetchLeagues(profileId);
    }
  }, [profileId, fetchInvites, fetchLeagues]);

  return (
    <div className="max-w-8xl py-6 mx-auto px-8">
      <h3 className="text-3xl text-center font-semibold text-gray-800 mb-6">
        Hello {account.userName}, welcome to your dashboard!
      </h3>
      <DashBoardLeaguePanel />
    </div>
  );
}

export default DashboardPage;