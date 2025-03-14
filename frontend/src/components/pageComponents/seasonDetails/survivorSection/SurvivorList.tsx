import React from 'react';
import { Season, Survivor } from '../../../../../generated-api';
import SurvivorRow from './SurvivorRow';

interface SurvivorListProps {
  survivors: Survivor[];
  seasonId: Season['id'];
}

const SurvivorList: React.FC<SurvivorListProps> = ({ survivors, seasonId }) => {
  return (
    <div className='w-full space-y-5'>
      {survivors.map((survivor) => (
        <SurvivorRow survivor={survivor} seasonId={seasonId} />
      ))}
    </div>
  );
};

export default SurvivorList;
