import React from 'react';
import { Season as SeasonObject } from '../../../generated-api';
import SeasonLogoImage from '../ui/image/SeasonLogoImage';
import {
  ButtonPrimaryBgColor,
  ElementBackgroundColorWithHover,
} from '../../styles/CommonColorClassNames';
import { Button } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

interface SeasonProps {
  season: SeasonObject;
}

const Season: React.FC<SeasonProps> = ({ season }) => {
  const navigate = useNavigate();

  function handleViewClick() {
    navigate(`/admin/season/${season.id}`);
  }

  return (
    <div
      className={`flex flex-col space-y-4 shadow-md p-4 ${ElementBackgroundColorWithHover}`}>
      <div className={`flex flex-row space-x-4 w-full`}>
        {/* Season and Image container */}
        <div className='flex flex-col space-y-4 w-1/4'>
          <h1 className='text-left text-2xl font-bold'>Season: {season.id}</h1>
          <SeasonLogoImage seasonId={season.id} className='w-full h-auto' />
        </div>

        <div className='flex flex-col space-y-2 w-3/4 text-left'>
          {/* Season Name */}
          <div>
            <span className='font-bold'>Name: </span>
            {season.name}
          </div>

          {/* Season Theme */}
          <div>
            <span className='font-bold'>Theme: </span>
            {season.theme}
          </div>

          {/* Air Dates */}
          <div>
            <span className='font-bold'>Air Dates: </span>
            {new Date(season.startDate).toLocaleDateString()}-
            {new Date(season.endDate).toLocaleDateString()}
          </div>

          {/* Season Location */}
          <div>
            <span className='font-bold'>Location: </span>
            {season.location}
          </div>

          {/* Season IsActive */}
          <div>
            <span className='font-bold'>Active: </span>
            {season.isActive ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
      <div id='buttons'>
        <Button
          className={`w-full  ${ButtonPrimaryBgColor} rounded-md py-4`}
          onClick={handleViewClick}>
          View
        </Button>
      </div>
    </div>
  );
};

export default Season;
