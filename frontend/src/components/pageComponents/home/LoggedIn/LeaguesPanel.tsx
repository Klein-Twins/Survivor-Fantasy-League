import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store';
import { openModal } from '../../../../store/slices/modalSlice';
import LoadingData from '../../../ui/LoadingData';
import LeagueRows from '../../../league/leaguesPanel/LeagueRows';
import Panel from '../../../ui/panels/Panel';

const LeaguesPanel: React.FC = () => {
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
    <Panel
      header='Your Leagues'
      actions={
        <FaPlusCircle
          onClick={handleAddLeagueClick}
          className={`text-3xl text-primary-a1-light dark:text-primary-a1-dark hover:text-primary-a3-light hover:dark:text-primary-a4-dark cursor-pointer`}
        />
      }>
      {leaguePanelContent}
    </Panel>
  );
};

const NoLeaguesMessage: React.FC<{ onCreateLeagueClick: () => void }> = ({
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
        className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
        onClick={onCreateLeagueClick}>
        Create League
      </button>
    </div>
  );
};

export default LeaguesPanel;
