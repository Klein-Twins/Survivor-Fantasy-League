import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { LeagueInviteCard } from './LeagueInviteCard';
import { TextPrimaryColor } from '../../../styles/CommonColorClassNames';

const LeagueInvitesList: React.FC = () => {
  const leagueInvites = useSelector(
    (state: RootState) => state.leagueInvite.leagueInvites
  );

  return (
    <>
      {leagueInvites.length > 0 ? (
        leagueInvites.map((leagueInvite) => (
          <LeagueInviteCard
            key={leagueInvite.inviteId}
            leagueInvite={leagueInvite}
          />
        ))
      ) : (
        <p className={`text-center p-8 ${TextPrimaryColor}`}>
          No pending invites
        </p>
      )}
    </>
  );
};

export default LeagueInvitesList;
