import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import SurveyPanel from '../components/league/survey/SurveyPanel';
import { League } from '../../generated-api';

const LeaguePage: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { leagueId } = useParams<{ leagueId: string }>();

  //if no account stored in state, user accessed via typing in URL and not logged in
  const account = useSelector((state: RootState) => state.auth.account);
  if (!account || !account.profileId) {
    return <h1>Please relog in to the application.</h1>;
  }

  const leagueState = useSelector((state: RootState) => state.league);
  const league: League | undefined = leagueState.leagues.find(
    (league) => league.leagueId === leagueId
  );
  if (!league) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <SurveyPanel league={league} account={account} />
    </div>
  );
};

export default LeaguePage;
