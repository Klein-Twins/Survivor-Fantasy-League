import React from 'react';
import { Pick } from '../../../../../generated-api';
import PickOptions from './pickOptions/pickOptions';

interface PickProps {
  pick: Pick;
  pickSelection: {
    selectedItems: any[];
    handleOptionClick: (item: any, getId: (item: any) => string) => void;
    isCompleted: boolean;
  };
  disabled?: boolean;
  showPickInstructions?: boolean;
}

export const PickView: React.FC<PickProps> = ({
  pick,
  pickSelection,
  disabled = false,
  showPickInstructions = true,
}) => {
  const backgroundColor =
    'dark:bg-surface-a3-dark bg-surface-a3-light text-white p-4';

  return (
    <div
      className={`flex flex-col space-y-2 w-full h-full rounded-md ${backgroundColor}`}>
      <p className='text-xl text-center font-bold'>{pick.description}</p>
      <PickOptions
        pick={pick}
        pickSelection={pickSelection}
        showPickInstructions={showPickInstructions}
        disabled={disabled}
      />
    </div>
  );
};
