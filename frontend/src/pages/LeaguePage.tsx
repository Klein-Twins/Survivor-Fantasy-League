import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import SurveyPanel from '../components/league/survey/SurveyPanel';
import { ButtonPrimaryColors } from '../styles/CommonColorClassNames';
import LeagueName from '../components/league/leaguePage/LeagueName';
import LeagueWelcomeMessage from '../components/league/leaguePage/WelcomeMessage';
import { Profile } from '../../generated-api';
import LeagueMemberPanel from '../components/league/leaguePage/leagueMembers/LeagueMemberPanel';
import SurveyStatusMessage from '../components/league/leaguePage/survey/SurveyStatusMessage';

const LeaguePage: React.FC = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const league = useSelector((state: RootState) =>
    state.league.leagues.find((l) => l.leagueId === leagueId)
  );
  const account = useSelector((state: RootState) => state.auth.account);

  if (!league) {
    return <NotInLeaguePage />;
  }

  return (
    <div className='container mx-auto flex-flex-col space-y-4'>
      <LeagueName
        leagueName={league.name}
        className='pt-4 text-3xl text-center font-bold'
      />
      <LeagueWelcomeMessage
        profile={account as Profile}
        className='text-2xl text-center font-semibold'
      />
      <SurveyStatusMessage />
      <LeagueMemberPanel leagueMembers={league.leagueMembers} />
      <SurveyPanel league={league} account={account} />
    </div>
  );
};

export default LeaguePage;

const NotInLeaguePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className='container mx-auto p-4 text-center'>
      <h1 className='text-3xl font-bold mb-4'>
        You are not part of this league
      </h1>
      <button
        onClick={() => navigate('/')}
        className={`${ButtonPrimaryColors} py-4 px-8 rounded-md`}>
        Back To Home
      </button>
    </div>
  );
};
