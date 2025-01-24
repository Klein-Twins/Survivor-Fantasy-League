import React from 'react';
import { League } from '../../../../generated-api';
import { LeagueDisplay } from './LeagueDisplay';

interface LeagueCardProps {
  league: League;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({ league }) => (
  <div className='w-full flex relative'>
    <LeagueDisplay league={league} />
  </div>
);
