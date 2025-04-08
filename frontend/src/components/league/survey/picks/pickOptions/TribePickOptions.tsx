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
  const minNumSelections = Math.max(1, pick.options.minNumSelections); // Ensure min is at least 1
  const maxNumSelections = Math.max(
    minNumSelections,
    pick.options.maxNumSelections
  );
  const noneOptionAccepted = pick.options.noneOptionAllowed;
  const tribeOptions = pick.options.options as Tribe[];

  if (pick.options.pickOptionType !== PickOptionTypeEnum.Tribe) {
    throw new Error('Pick option type is not Tribe');
  }

  const [selectedTribes, setSelectedTribes] = useState<Tribe[]>([]);
  function handleOptionClick(tribe: Tribe) {
    setSelectedTribes((prevSelected) => {
      if (prevSelected.some((t) => t.id === tribe.id)) {
        // If already selected, remove it
        return prevSelected.filter((t) => t.id !== tribe.id);
      } else if (prevSelected.length < maxNumSelections) {
        // If not selected and within max limit, add it
        return [...prevSelected, tribe];
      } else {
        // If max limit is exceeded, remove the oldest selection and add the new one
        const [, ...remaining] = prevSelected; // Remove the first (oldest) selection
        return [...remaining, tribe];
      }
    });
  }

  const selectableCountMessage =
    minNumSelections === maxNumSelections
      ? `Select ${minNumSelections} tribe(s)`
      : `Select ${minNumSelections} - ${maxNumSelections} tribes`;

  return (
    <>
      <div className='w-full'>
        <p className='text-center'>{selectableCountMessage}</p>
      </div>
      <div className='flex flex-cols space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full'>
        {tribeOptions.map((tribe) => (
          <TribePickOption
            key={tribe.id}
            tribe={tribe}
            onClick={() => handleOptionClick(tribe)}
            isSelected={selectedTribes.some((t) => t.id === tribe.id)}
          />
        ))}
      </div>
    </>
  );
};

export default TribePickOptions;

interface TribePickOptionProps {
  tribe: Tribe;
  onClick: () => void;
  isSelected: boolean;
}

const TribePickOption: React.FC<TribePickOptionProps> = ({
  tribe,
  onClick,
  isSelected,
}) => {
  const selectedSeasonId = useSelector(
    (state: RootState) => state.season.selectedSeason
  ).id;

  const tribeColor = tribe.color.hex;
  const optionBackgroundStyle = {
    backgroundColor: tribeColor, // Use the hex color as the background
    opacity: isSelected ? 0.7 : 1, // Add opacity if selected
    fontWeight: isSelected ? 'bold' : 'normal', // Add bold font if selected
  };

  return (
    <div
      className='flex w-full flex-col items-center space-y-1 rounded-md p-2'
      style={optionBackgroundStyle} // Apply the dynamic styles here
      onClick={onClick}>
      <TribeImage tribeId={tribe.id} seasonId={selectedSeasonId} />
      <p className='text-center'>{tribe.name}</p>
      <div className='grid grid-cols-3 gap-2'>
        {tribe.survivors.map((survivor) => (
          <div className='flex flex-col items-center justify-center w-full text-nowrap'>
            {survivor.firstName}
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
