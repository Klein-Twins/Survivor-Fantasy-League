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
          <p>
            <p className='font-bold inline'>Name: </p>
            {season.name}
          </p>

          {/* Season Theme */}
          <p>
            <p className='font-bold inline'>Theme: </p>
            {season.theme}
          </p>

          {/* Air Dates */}
          <p>
            <p className='font-bold inline'>Air Dates: </p>
            {new Date(season.startDate).toLocaleDateString()}-
            {new Date(season.endDate).toLocaleDateString()}
          </p>

          {/* Season Location */}
          <p>
            <p className='font-bold inline'>Location: </p>
            {season.location}
          </p>

          {/* Season IsActive */}
          <p>
            <p className='font-bold inline'>Active: </p>
            {season.isActive ? 'Yes' : 'No'}
          </p>
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

/*

        <div className='flex justify-between'>
          <h2 className='text-lg'>
            Start Date: {new Date(season.startDate).toLocaleDateString()}
          </h2>
          <h2 className='text-lg'>
            End Date: {new Date(season.endDate).toLocaleDateString()}
          </h2>
        </div>
        <div className='flex justify-between'>
          <h2 className='text-lg'>Location: {season.location}</h2>
          <h2 className='text-lg'>
            Theme: {season.theme ? season.theme : 'No theme available.'}
          </h2>
        </div>
        <h2 className='text-lg'>
          Season Name: {season.name ? season.name : 'No name available.'}
        </h2>

        */
