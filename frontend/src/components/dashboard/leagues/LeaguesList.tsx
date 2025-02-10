import React from 'react';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';
import { LeagueCard } from './LeagueCard';
import { TextPrimaryColor } from '../../../styles/CommonColorClassNames';

const LeaguesList: React.FC = () => {
  const leagues = useSelector((state: RootState) => state.league.leagues);

  return (
    <>
      {leagues.length > 0 ? (
        leagues.map((league) => (
          <LeagueCard key={league.leagueId} league={league} />
        ))
      ) : (
        <p className={`text-center p-8 ${TextPrimaryColor}`}>No Leagues</p>
      )}
    </>
  );
};

export default LeaguesList;
