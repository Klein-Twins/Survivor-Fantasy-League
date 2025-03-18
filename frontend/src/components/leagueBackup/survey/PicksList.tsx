import React from 'react';
import { Pick } from '../../../../generated-api';
import PickItem from './PickItem';

interface PicksListProps {
  picks: Pick[];
}

const PicksList: React.FC<PicksListProps> = ({ picks }) => {
  return (
    <>
      <div className='flex flex-col w-full space-y-2 items-center'>
        <h2 className='text-center text-3xl font-bold'>Your Survey</h2>
        {picks.map((pick) => {
          return <PickItem key={pick.id} pick={pick} />;
        })}
      </div>
    </>
  );
};

export default PicksList;
