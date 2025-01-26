import React from 'react';
import { League } from '../../../../generated-api';
import { LeagueDisplay } from './LeagueDisplay';

interface LeagueCardProps {
  league: League;
  classname?: string;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({ league, classname }) => (
  <div className={`w-full flex relative ${classname}`}>
    <LeagueDisplay league={league} />
  </div>
);
