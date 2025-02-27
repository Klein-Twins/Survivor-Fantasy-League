import React from 'react';
import { Season as SeasonObject } from '../../../generated-api';

interface SeasonProps {
  season: SeasonObject;
}

const Season: React.FC<SeasonProps> = ({ season }) => {
  return (
    <div className='flex flex-col space-y-2'>
      <h1>Season Number: {season.id}</h1>
      <h2>Season Name: {season.name ? season.name : 'No name available.'}</h2>
      <h2>Start Date: {season.startDate}</h2>
      <h2>End Date: {season.endDate}</h2>
      <h2>Location: {season.location}</h2>
      <h2>Theme: {season.theme ? season.theme : 'No theme available.'}</h2>
    </div>
  );
};

export default Season;
