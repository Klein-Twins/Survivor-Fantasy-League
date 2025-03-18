import React, { useState } from 'react';
import { Pick } from '../../../../../generated-api';
import PickOptions from './pickOptions/pickOptions';

interface PickProps {
  pick: Pick;
}

const PickView: React.FC<PickProps> = ({ pick }) => {
  const [selectedPickOption, setSelectedPickOption] = useState<Pick | null>(
    null
  );

  return (
    <div>
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
