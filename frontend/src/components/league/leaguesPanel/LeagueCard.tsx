import React from 'react';
import { League } from '../../../../generated-api';
import LeagueImage from '../../ui/image/LeagueImage';

interface LeagueCardProps {
  league: League;
}

const LeagueCard: React.FC<LeagueCardProps> = ({ league }) => {
  return (
    <div className='w-full flex flex-col items-center p-4 bg-surface-a3-light dark:bg-surface-a3-dark rounded-lg shadow-md'>
      <LeagueImage
        leagueId={league.leagueId}
        className='w-32 h-32 object-cover rounded-md mb-4'
      />
      <h2 className='text-xl font-semibold mb-2 text-center'>{league.name}</h2>
      <p className='mb-4'>2nd place</p>
      <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
        View League
      </button>
    </div>
  );
};

export default LeagueCard;
