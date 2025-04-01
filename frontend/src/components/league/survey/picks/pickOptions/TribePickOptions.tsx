import React, { useState } from 'react';
import {
  Pick,
  PickOptionTypeEnum,
  Tribe,
} from '../../../../../../generated-api';
import TribeImage from '../../../../season/tribes/TribeImage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/store';
import SurvivorImage from '../../../../ui/image/SurvivorImage';

interface TribePickOptionsProps {
  pick: Pick;
}

const TribePickOptions: React.FC<TribePickOptionsProps> = ({ pick }) => {
  const [choice, setChoice] = useState<Tribe['id'] | null>(null);
  function handleOptionClick(tribeId: Tribe['id']) {
    setChoice(tribeId);
  }
  if (pick.optionType !== PickOptionTypeEnum.Tribe) {
    return null;
  }
  const tribes = pick.options as Tribe[];

  return (
    <div className='flex flex-cols space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full'>
      {tribes.map((tribe) => (
        <TribePickOption
          key={tribe.id}
          tribe={tribe}
          onClick={handleOptionClick}
          choice={choice}
        />
      ))}
    </div>
  );
};

export default TribePickOptions;

interface TribePickOptionProps {
  tribe: Tribe;
  onClick: (survivorId: Tribe['id']) => void;
  choice: Tribe['id'] | null;
}

const TribePickOption: React.FC<TribePickOptionProps> = ({
  tribe,
  onClick,
  choice,
}) => {
  const selectedSeasonId = useSelector(
    (state: RootState) => state.season.selectedSeason.id
  );
  function handleClick(survivorId: Tribe['id']) {
    if (choice === survivorId) {
      onClick(null);
    } else {
      onClick(survivorId);
    }
  }

  const tribeColor = tribe.color.hex;
  const optionBackgroundStyle = {
    backgroundColor: tribeColor, // Use the hex color as the background
    opacity: tribe.id === choice ? 0.7 : 1, // Add opacity if selected
    fontWeight: tribe.id === choice ? 'bold' : 'normal', // Add bold font if selected
  };

  return (
    <div
      className='flex w-full flex-col items-center space-y-1 rounded-md p-2'
      style={optionBackgroundStyle} // Apply the dynamic styles here
      onClick={() => handleClick(tribe.id)}>
      <TribeImage tribeId={tribe.id} seasonId={selectedSeasonId} />
      <p className='text-center'>{tribe.name}</p>
      <div className='grid grid-cols-3 gap-2'>
        {tribe.survivors.map((survivor) => (
          <div className='flex flex-col items-center justify-center w-full text-nowrap'>
            {survivor.name}
            <SurvivorImage
              seasonId={selectedSeasonId}
              survivorName={''}
              survivorId={survivor.id}
              className='w-8 h-8'
            />
          </div>
        ))}
      </div>
    </div>
  );
};
