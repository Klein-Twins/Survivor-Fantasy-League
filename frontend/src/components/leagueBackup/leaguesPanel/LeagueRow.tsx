import React from 'react';
import { League } from '../../../../generated-api';
import LeagueImage from '../../ui/image/LeagueImage';
import { ButtonPrimaryColors } from '../../../styles/CommonColorClassNames';
import { useNavigate } from 'react-router-dom';

const TROPHY_COLORS = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

interface LeagueRowProps {
  league: League;
}

const LeagueRow: React.FC<LeagueRowProps> = ({ league }) => {
  const navigate = useNavigate();

  //Randomly assign color to gold, silver or bronze
  const randomColor = Math.floor(Math.random() * 3);
  let color = '';
  switch (randomColor) {
    case 0:
      color = TROPHY_COLORS.gold;
      break;
    case 1:
      color = TROPHY_COLORS.silver;
      break;
    case 2:
      color = TROPHY_COLORS.bronze;
      break;
    default:
      color = TROPHY_COLORS.gold;
      break;
  }

  function handleViewLeagueClick(leagueId: League['id']) {
    navigate(`/league/${league.id}`);
  }

  return (
    <div className='flex items-center justify-between p-4 bg-surface-a2-light dark:bg-surface-a2-dark shadow-md'>
      <div className='flex items-center'>
        <LeagueImage
          leagueId={league.id}
          className='w-16 h-16 object-cover rounded-md mr-4'
        />
        <div>
          <h2 className='text-xl font-semibold text-primary-a0-light dark:text-primary-a0-dark'>
            {league.name}
          </h2>
          <p style={{ color: TROPHY_COLORS.silver }}>
            {/* <FaTorch className='inline-block mr-2' /> */}
            2nd place
          </p>
        </div>
      </div>
      <button
        onClick={() => handleViewLeagueClick(league.id)}
        className={`px-4 py-2 ${ButtonPrimaryColors} rounded-md transition-colors`}>
        View League
      </button>
    </div>
  );
};

export default LeagueRow;
