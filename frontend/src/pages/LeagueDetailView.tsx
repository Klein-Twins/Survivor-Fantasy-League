import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import SurveyPanel from '../components/league/survey/SurveyPanel';

const LeagueDetailView: React.FC = () => {
  const location = useLocation();
  const { leagueId } = useParams<{ leagueId: string }>();
  const account = useSelector((state: RootState) => state.auth.account);

  if (!account || !account.profileId) {
    return <h1>Please relog in to the application.</h1>;
  }

  return <SurveyPanel />;
};

export default LeagueDetailView;
