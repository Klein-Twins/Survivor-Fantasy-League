import React from 'react';
import { League } from '../../../../generated-api';
import {
  ButtonPrimaryColors,
  HorizontalLinePrimaryColors,
} from '../../../styles/CommonColorClassNames';
import { FaPlusCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { openModal } from '../../../store/slices/modalSlice';
import LoadingData from '../../ui/LoadingData';
import LeagueRows from '../../league/leaguesPanel/LeagueRows';

interface LeaguesPanelProps {}

const LeaguesPanel: React.FC<LeaguesPanelProps> = () => {
  const leagueState = useSelector((state: RootState) => state.league);
  const leagues = leagueState.leagues;

  const dispatch = useDispatch<AppDispatch>();

  function handleAddLeagueClick() {
    dispatch(openModal({ type: 'createLeague' }));
  }

  const leaguePanelContent = leagueState.loading ? (
    <LoadingData text='Loading leagues' />
  ) : leagues.length === 0 ? (
    <NoLeaguesMessage onCreateLeagueClick={handleAddLeagueClick} />
  ) : (
    <LeagueRows leagues={leagues} />
  );

  return (
    <div className='flex flex-col w-full rounded-md dark:bg-surface-a1-dark dark:text-primary-a1-dark bg-surface-a1-light text-primary-a1-light'>
      <LeaguesPanelHeader onPlusClick={handleAddLeagueClick} />
      {leaguePanelContent}
    </div>
  );
};

interface LeaguesPanelHeaderProps {
  onPlusClick: () => void;
}

const LeaguesPanelHeader: React.FC<LeaguesPanelHeaderProps> = ({
  onPlusClick,
}) => {
  return (
    <>
      <div className='flex items-center justify-center relative py-4'>
        <h1 className='text-4xl font-bold'>Your Leagues</h1>
        <button className='absolute right-4'>
          <FaPlusCircle
            onClick={onPlusClick}
            className={`text-3xl text-primary-a1-light dark:text-primary-a1-dark hover:text-primary-a3-light hover:dark:text-primary-a4-dark`}
          />
        </button>
      </div>
      <hr className={`w-full ${HorizontalLinePrimaryColors}`} />
    </>
  );
};

interface NoLeaguesMessageProps {
  onCreateLeagueClick: () => void;
}

const NoLeaguesMessage: React.FC<NoLeaguesMessageProps> = ({
  onCreateLeagueClick,
}) => {
  return (
    <div className='flex flex-col items-center justify-center text-center p-6'>
      <h2 className='text-2xl font-semibold mb-2'>
        You are not part of any leagues
      </h2>
      <p className='text-lg mb-4'>
        Join a league or create a new one to get started!
      </p>
      <button
        className={`${ButtonPrimaryColors} px-4 py-2 rounded-lg transition-colors`}
        onClick={onCreateLeagueClick}>
        Create League
      </button>
    </div>
  );
};

export default LeaguesPanel;
