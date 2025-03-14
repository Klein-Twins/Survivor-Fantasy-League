import React from 'react';
import { useSelector } from 'react-redux';
import LoadingData from '../../../ui/LoadingData';
import { RootState } from '../../../../store/store';
import LeagueInviteRows from '../../../league/leagueInvitesPanel/LeagueInviteRows';
import Panel from '../../../ui/panels/Panel';

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

  return <Panel header='League Invites'>{leagueInvitesPanelContent}</Panel>;
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

export default LeagueInvitesPanel;
