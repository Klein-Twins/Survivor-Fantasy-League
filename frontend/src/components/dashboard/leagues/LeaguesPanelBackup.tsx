import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import BasicLeagueCard from './BasicLeagueCard';
import LeagueInviteCard from './LeagueInviteCard';

const LeaguesPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leagues' | 'invites'>('leagues');
  const leagues = useSelector((state: RootState) => state.league.leagues);
  const leagueInvites = useSelector((state: RootState) => state.leagueInvite.leagueInvites);

  if (!leagues) {
    return <p>SHOULDNT SEE THIS</p>;
  }

  return (
    <>
      <div className='bg-background-dp02 rounded-lg p-2 flex flex-col space-y-2'>
        <div className='flex space-x-4 border-b border-background-dp03'>
          <button
            className={`px-4 py-2 ${
              activeTab === 'leagues'
                ? 'text-text-primary border-b-2 border-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('leagues')}>
            My Leagues
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'invites'
                ? 'text-text-primary border-b-2 border-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('invites')}>
            League Invites
          </button>
        </div>
        {activeTab === 'leagues' &&
          leagues.map((league) => {
            return <BasicLeagueCard key={league.leagueId} league={league} />;
          })}
        {activeTab === 'leagues' && leagues.length === 0 && (
          <p className='text-center text-subtitle text-text-primary p-8'>You have not joined any leagues</p>
        )}
        {activeTab === 'invites' &&
          leagueInvites.length > 0 &&
          leagueInvites.map((leagueInvite) => {
            return <BasicLeagueCard key={leagueInvite.inviteId} leagueInvite={leagueInvite} />;
          })}
        {activeTab === 'invites' && leagueInvites.length === 0 && (
          <p className='text-center text-subtitle text-text-primary p-8'>You have no pending league invites</p>
        )}
      </div>
    </>
  );
};

export default LeaguesPanel;
