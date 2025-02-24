import React from 'react';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';
import { LeagueCard } from './LeagueCard';
import NoLeaguesMessage from './NoLeaguesMessage';

const LeaguesList: React.FC = () => {
  const leagues = useSelector((state: RootState) => state.league.leagues);

  return (
    <>
      {leagues.length > 0 ? (
        leagues.map((league) => (
          <LeagueCard key={league.leagueId} league={league} />
        ))
      ) : (
        <NoLeaguesMessage />
      )}
    </>
  );
};

export default LeaguesList;
