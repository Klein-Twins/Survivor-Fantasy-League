import React from 'react';
import { Season, Survivor } from '../../../../generated-api';

interface SurvivorListForSeasonProps {
  season: Season;
}

const SurvivorListForSeason: React.FC<SurvivorListForSeasonProps> = ({
  season,
}) => {
  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>
        Survivor list for season {season.id}
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {season.survivors.map((survivor) => (
          <SurvivorCard key={survivor.survivorId} survivor={survivor} />
        ))}
      </div>
    </div>
  );
};

interface SurvivorCardProps {
  survivor: Survivor;
}

const SurvivorCard: React.FC<SurvivorCardProps> = ({ survivor }) => {
  return (
    <div className='bg-white shadow-md rounded-lg p-4'>
      <h3 className='text-xl font-semibold mb-2'>
        {survivor.firstName} {survivor.lastName}
      </h3>
      <p>
        <span className='font-bold'>Age:</span> {survivor.age}
      </p>
      <p>
        <span className='font-bold'>Nickname:</span> {survivor.nickName}
      </p>
      <p>
        <span className='font-bold'>Job:</span> {survivor.job}
      </p>
      <p>
        <span className='font-bold'>Description:</span> {survivor.description}
      </p>
      <p>
        <span className='font-bold'>From:</span> {survivor.fromCity},{' '}
        {survivor.fromState}, {survivor.fromCountry}
      </p>
    </div>
  );
};

export default SurvivorListForSeason;
