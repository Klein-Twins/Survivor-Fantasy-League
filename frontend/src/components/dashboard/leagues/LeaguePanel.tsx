import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { LeagueCard } from './LeagueCard';
import { LeagueInviteCard } from './LeagueInviteCard';
import CreateLeagueForm from './CreateLeagueForm';
import PanelWithTabs from '../../ui/panels/panelWithBar/PanelWithTabs';

export const LeaguesPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leagues' | 'invites' | 'create'>('leagues');
  const leagues = useSelector((state: RootState) => state.league.leagues);
  const leagueInvites = useSelector((state: RootState) => state.leagueInvite.leagueInvites);
  const className = 'dark:bg-surface-a2-dark';

  const tabs = [
    {
      id: 'leagues',
      label: 'My Leagues',
      content:
        leagues.length > 0 ? (
          leagues.map((league) => (
            <LeagueCard key={league.leagueId} league={league} classname='dark:bg-surface-a2-dark' />
          ))
        ) : (
          <p className='text-center text-subtitle text-text-primary p-8'>You have not joined any leagues</p>
        ),
    },
    {
      id: 'invites',
      label: 'League Invites',
      content:
        leagueInvites.length > 0 ? (
          leagueInvites.map((invite) => (
            <LeagueInviteCard key={invite.inviteId} leagueInvite={invite} className='dark:bg-surface-a2-dark' />
          ))
        ) : (
          <p className='text-center text-subtitle text-text-primary p-8'>No pending invites</p>
        ),
    },
  ];
  return (
    <div className='dark:bg-surface-a1-dark'>
      <PanelWithTabs tabs={tabs} className={className} />
    </div>
  );

  // return (
  //   <div className='bg-background-dp02 rounded-lg p-2 flex flex-col space-y-2'>
  //     <div className='flex justify-between border-b border-background-dp03 mb-2'>
  //       <div>
  //         {' '}
  //         <button
  //           className={`px-4 py-2 ${
  //             activeTab === 'leagues'
  //               ? 'text-text-primary border-b-2 border-text-primary'
  //               : 'text-text-secondary hover:text-text-primary'
  //           }`}
  //           onClick={() => setActiveTab('leagues')}>
  //           My Leagues
  //         </button>
  //         <button
  //           className={`px-4 py-2 ${
  //             activeTab === 'invites'
  //               ? 'text-text-primary border-b-2 border-text-primary'
  //               : 'text-text-secondary hover:text-text-primary'
  //           }`}
  //           onClick={() => setActiveTab('invites')}>
  //           League Invites
  //         </button>
  //       </div>

  //       <button
  //         className={`px-4 py-2  ${
  //           activeTab === 'create'
  //             ? 'text-text-primary border-b-2 border-text-primary'
  //             : 'text-text-secondary hover:text-text-primary'
  //         }`}
  //         onClick={() => setActiveTab('create')}>
  //         Create League
  //       </button>
  //     </div>

  //     {activeTab === 'leagues' &&
  //       (leagues.length > 0 ? (
  //         leagues.map((league) => (
  //           <LeagueCard key={league.leagueId} league={league} classname='dark:bg-surface-a2-dark' />
  //         ))
  //       ) : (
  //         <p className='text-center text-subtitle text-text-primary p-8'>You have not joined any leagues</p>
  //       ))}

  //     {activeTab === 'invites' &&
  //       (leagueInvites.length > 0 ? (
  //         leagueInvites.map((invite) => (
  //           <LeagueInviteCard key={invite.inviteId} leagueInvite={invite} className='dark:bg-surface-a2-dark' />
  //         ))
  //       ) : (
  //         <p className='text-center text-subtitle text-text-primary p-8'>You have no pending league invites</p>
  //       ))}

  //     {activeTab === 'create' && <CreateLeagueForm />}
  //   </div>
  // );
};
