import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { HorizontalLinePrimaryColors } from '../../../styles/CommonColorClassNames';
import LoadingData from '../../ui/LoadingData';
import LeagueInviteRows from '../../league/leagueInvitesPanel/LeagueInviteRows';

const LeagueInvitesPanel: React.FC = () => {
  const leagueInviteState = useSelector(
    (state: RootState) => state.leagueInvite
  );
  const leagueInvites = leagueInviteState.leagueInvites;

  const leagueInvitesPanelContent = leagueInviteState.loading ? (
    <LoadingData text='Loading League Invites' />
  ) : leagueInvites.length === 0 ? (
    <NoLeagueInvitesMessage />
  ) : (
    <LeagueInviteRows leagueInvites={leagueInvites} />
  );

  return (
    <div className='flex flex-col w-full rounded-md dark:bg-surface-a1-dark dark:text-primary-a1-dark bg-surface-a1-light text-primary-a1-light'>
      <LeagueInvitesPanelHeader />
      {leagueInvitesPanelContent}
    </div>
  );
};

const NoLeagueInvitesMessage: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center text-center p-6'>
      <h2 className='text-2xl font-semibold mb-2'>
        You have no pending league invites
      </h2>
    </div>
  );
};

const LeagueInvitesPanelHeader: React.FC = () => {
  return (
    <>
      <div className='flex items-center justify-center py-4'>
        <h1 className='text-4xl font-bold'>League Invites</h1>
      </div>
      <hr className={`w-full ${HorizontalLinePrimaryColors}`} />
    </>
  );
};

export default LeagueInvitesPanel;
