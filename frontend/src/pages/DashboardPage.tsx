import { useEffect, useState } from "react";
import LeagueList from "../components/dashboard/league/LeagueList";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { openModal } from "../store/slices/modalSlice";
import LeaguesPanel from "../components/dashboard/league/LeaguesPanel";

function DashboardPage() {

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6">
          Hello Michael, welcome to your dashboard!
        </h3>
        <LeaguesPanel />
      </div>
    </div>
  );
}

export default DashboardPage;
