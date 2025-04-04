import React from 'react';
import { League } from '../../../../generated-api';
import LeagueCardProfile from './LeagueCardProfile';
import { useNavigate } from 'react-router-dom';
import LeagueImage from '../../ui/image/LeagueImage';

interface LeagueDisplayProps {
  league: League;
  message?: string;
}

export const LeagueDisplay: React.FC<LeagueDisplayProps> = ({
  league,
  message,
}) => {
  const navigate = useNavigate();
  return (
    <div className='flex-1 rounded-xl p-4'>
      <div className='flex justify-start space-x-4 h-full'>
        {/* League Image Container */}
        <div className='w-48 h-48 rounded-lg overflow-hidden flex-shrink-0'>
          <LeagueImage leagueId={league.leagueId} className='w-full h-full' />
        </div>
        <div className='flex flex-col justify-between flex-1'>
          <div className='flex flex-col space-y-2 mb-4'>
            <div
              className='text-title font-semibold cursor-pointer hover:text-primary'
              onClick={() => navigate(`/league/${league.leagueId}`)}>
              {league.name}
            </div>
            <div className='text-subtitle'>Season: {league.season.id}</div>
            {message && (
              <div className='text-text-primary text-subtitle'>{message}</div>
            )}
          </div>
          {/* <div className='flex justify-start items-center space-x-4'>
            {league.leagueMembers.map((member) => (
              <LeagueCardProfile
                key={member.profile.profileId}
                leagueMember={member}
              />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};
