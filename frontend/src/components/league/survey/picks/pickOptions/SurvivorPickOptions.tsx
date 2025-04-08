import { useState } from 'react';
import {
  Pick,
  PickOptionTypeEnum,
  Survivor,
} from '../../../../../../generated-api';
import SurvivorImage from '../../../../ui/image/SurvivorImage';

interface SurvivorPickOptionsProps {
  pick: Pick;
}

const SurvivorPickOptions: React.FC<SurvivorPickOptionsProps> = ({ pick }) => {
  const minNumSelections = Math.max(1, pick.options.minNumSelections); // Ensure min is at least 1
  const maxNumSelections = Math.max(
    minNumSelections,
    pick.options.maxNumSelections
  );
  const noneOptionAccepted = pick.options.noneOptionAllowed;
  const survivorOptions = pick.options.options as Survivor[];

  if (pick.options.pickOptionType !== PickOptionTypeEnum.Survivor) {
    throw new Error('Pick option type is not Survivor');
  }

  const [selectedSurvivors, setSelectedSurvivors] = useState<Survivor[]>([]);
  function handleOptionClick(survivor: Survivor) {
    setSelectedSurvivors((prevSelected) => {
      if (prevSelected.some((s) => s.id === survivor.id)) {
        // If already selected, remove it
        return prevSelected.filter((s) => s.id !== survivor.id);
      } else if (prevSelected.length < maxNumSelections) {
        // If not selected and within max limit, add it
        return [...prevSelected, survivor];
      } else {
        // If max limit is exceeded, remove the oldest selection and add the new one
        const [, ...remaining] = prevSelected; // Remove the first (oldest) selection
        return [...remaining, survivor];
      }
    });
  }

  const selectableCountMessage =
    minNumSelections === maxNumSelections
      ? `Select ${minNumSelections} survivor(s)`
      : `Select ${minNumSelections} - ${maxNumSelections} survivors`;

  return (
    <>
      <div className='w-full'>
        <p className='text-center'>{selectableCountMessage}</p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4'>
        {survivorOptions.map((survivor) => (
          <SurvivorPickOption
            key={survivor.id}
            survivor={survivor}
            onClick={() => handleOptionClick(survivor)}
            isSelected={selectedSurvivors.some((s) => s.id === survivor.id)}
          />
        ))}
      </div>
    </>
  );
};

interface SurvivorPickOptionProps {
  survivor: Survivor;
  onClick: () => void;
  isSelected: boolean;
}

const SurvivorPickOption: React.FC<SurvivorPickOptionProps> = ({
  survivor,
  onClick,
  isSelected,
}) => {
  const optionBackground = isSelected
    ? 'dark:bg-surface-a3-dark bg-surface-a3-light font-bold'
    : 'dark:bg-surface-a1-dark bg-surface-a1-light';

  return (
    <div
      className={`flex flex-col items-center space-y-1 rounded-md p-2 ${optionBackground}`}
      onClick={onClick}>
      <SurvivorImage survivorId={survivor.id} seasonId={48} survivorName='' />
      <p className='text-center'>
        {survivor.firstName} {survivor.lastName}
      </p>
    </div>
  );
};

export default SurvivorPickOptions;
