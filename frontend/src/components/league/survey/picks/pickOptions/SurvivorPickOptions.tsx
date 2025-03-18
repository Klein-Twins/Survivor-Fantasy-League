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
  const [choice, setChoice] = useState<Survivor['id'] | null>(null);
  function handleOptionClick(survivorId: Survivor['id']) {
    setChoice(survivorId);
  }
  if (pick.optionType !== PickOptionTypeEnum.Survivor) {
    return null;
  }
  const survivors = pick.options as Survivor[];

  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
      {survivors.map((survivor) => (
        <SurvivorPickOption
          key={survivor.id}
          survivor={survivor}
          onClick={handleOptionClick}
          choice={choice}
        />
      ))}
    </div>
  );
};

interface SurvivorPickOptionProps {
  survivor: Survivor;
  onClick: (survivorId: Survivor['id']) => void;
  choice: Survivor['id'] | null;
}

const SurvivorPickOption: React.FC<SurvivorPickOptionProps> = ({
  survivor,
  onClick,
  choice,
}) => {
  function handleClick(survivorId: Survivor['id']) {
    if (choice === survivorId) {
      onClick(null);
    } else {
      onClick(survivorId);
    }
  }

  const optionBackground =
    survivor.id === choice
      ? 'dark:bg-surface-a3-dark bg-surface-a3-light font-bold'
      : 'dark:bg-surface-a1-dark bg-surface-a1-light';

  return (
    <div
      className={`flex flex-col items-center space-y-1 rounded-md p-2 ${optionBackground}`}
      onClick={() => handleClick(survivor.id)}>
      <SurvivorImage survivorId={survivor.id} seasonId={48} survivorName='' />
      <p className='text-center'>
        {survivor.firstName} {survivor.lastName}
      </p>
    </div>
  );
};

export default SurvivorPickOptions;
