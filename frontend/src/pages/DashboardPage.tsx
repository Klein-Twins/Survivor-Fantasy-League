import React from "react";
import LeaguesPanel from "../components/dashboard/leaguesPanel/LeaguesPanel";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

const DashboardPage: React.FC = () => {
  const account = useSelector((state: RootState) => state.auth.account);

  if (!account) {
    return <div>Please log in</div>
  }

  return (
    <div className="max-w-8xl py-6 mx-auto px-8">
      <h3 className="text-3xl text-center font-semibold text-gray-800 mb-6">
        Hello {account.userName}, welcome to your dashboard!
      </h3>
      <LeaguesPanel />
    </div>
  );
}

export default DashboardPage;