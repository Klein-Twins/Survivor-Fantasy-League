import React, { useState } from 'react';
import { Pick } from '../../../../../generated-api';
import PickOptions from './pickOptions/pickOptions';

interface PickProps {
  pick: Pick;
}

export const PickView: React.FC<PickProps> = ({ pick }) => {
  const [selectedPickOption, setSelectedPickOption] = useState<Pick | null>(
    null
  );
  const backgroundColor =
    'dark:bg-surface-a3-dark bg-surface-a3-light text-white p-4';

  return (
    <div
      className={`flex flex-col space-y-2 w-full h-full rounded-r-md ${backgroundColor}`}>
      <p className='text-xl text-center font-bold'>{pick.description}</p>
      <PickOptions pick={pick} />
    </div>
  );
};

interface PicksProps {
  picks: Pick[];
}

const Picks: React.FC<PicksProps> = ({ picks }) => {
  if (picks.length === 0) {
    return <p>No Picksss</p>;
  }

  return (
    <div className='flex flex-col space-y-8'>
      {picks.map((pick) => (
        <PickView pick={pick} />
      ))}
    </div>
  );
};

export default Picks;
