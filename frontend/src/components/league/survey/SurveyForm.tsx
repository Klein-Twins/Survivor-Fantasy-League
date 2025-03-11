import React, { useState, useEffect } from 'react';
import {
  BinaryOptionsEnum,
  Color,
  Pick,
  PickOptionTypeEnum,
  PickWithPlayerChoice,
  Survivor,
  Tribe,
} from '../../../../generated-api';
import { Button } from '@headlessui/react';
import { ButtonPrimaryColors } from '../../../styles/CommonColorClassNames';
import SurvivorImage from '../../ui/image/SurvivorImage';
import TribeImage from '../../season/tribes/TribeImage';
import SelectedIcon from './SelectedIcon';

interface SurveyFormProps {
  picks: Pick[];
  onSubmit: (picksWithPlayerChoice: PickWithPlayerChoice[]) => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ picks, onSubmit }) => {
  const [picksWithPlayerChoice, setPicksWithPlayerChoice] = useState<
    PickWithPlayerChoice[]
  >(
    picks.map((pick): PickWithPlayerChoice => {
      return {
        pick: pick,
        playerChoice: null,
      };
    })
  );

  const [allPicksSelected, setAllPicksSelected] = useState(false);

  useEffect(() => {
    const allSelected = picksWithPlayerChoice.every(
      (pick) => pick.playerChoice !== null
    );
    setAllPicksSelected(allSelected);
  }, [picksWithPlayerChoice]);

  const handlePickChange = (pickId: string, playerChoice: string | null) => {
    setPicksWithPlayerChoice((prevPicks) =>
      prevPicks.map((p) =>
        p.pick.id === pickId ? { ...p, playerChoice: playerChoice } : p
      )
    );
  };

  return (
    <div className='flex flex-col space-y-4 px-4'>
      {picks.map((pick) => {
        return (
          <FormPickInput
            key={pick.id}
            pick={pick}
            onPickChange={handlePickChange}
          />
        );
      })}
      <Button
        onClick={() => onSubmit(picksWithPlayerChoice)}
        disabled={!allPicksSelected}
        className={`w-full p-2 rounded-md ${ButtonPrimaryColors}`}>
        Submit
      </Button>
    </div>
  );
};

export default SurveyForm;

interface FormPickInputProps {
  pick: Pick;
  onPickChange: (pickId: string, playerChoice: string | null) => void;
}
const FormPickInput: React.FC<FormPickInputProps> = ({
  pick,
  onPickChange,
}) => {
  return (
    <div className='flex flex-col space-y-4 p-4 border border-gray-300 rounded-lg shadow-md'>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold text-center'>{pick.description} </h2>
        <h2 className='text-2xl'>Points: {pick.numPointsWorth}</h2>
      </div>
      <div className='container px-8 mx-auto'>
        <FormPickOptions
          pickOptionType={pick.pickOptionType}
          pickOptions={pick.pickOptions}
          pickId={pick.id}
          onPickChange={onPickChange}
        />
      </div>
    </div>
  );
};

interface FormPickOptionsProps {
  pickOptionType: Pick['pickOptionType'];
  pickOptions: Pick['pickOptions'];
  pickId: string;
  onPickChange: (pickId: string, playerChoice: string | null) => void;
}

const FormPickOptions: React.FC<FormPickOptionsProps> = ({
  pickOptionType,
  pickOptions,
  pickId,
  onPickChange,
}) => {
  switch (pickOptionType) {
    case PickOptionTypeEnum.Binary:
      return (
        <BinaryPickOptions
          pickOptions={pickOptions}
          pickId={pickId}
          onPickChange={onPickChange}
        />
      );
    case PickOptionTypeEnum.Color:
      return (
        <ColorPickOptions
          colors={pickOptions.options as Color[]}
          pickId={pickId}
          onPickChange={onPickChange}
        />
      );
    case PickOptionTypeEnum.Survivor:
      return (
        <SurvivorPickOptions
          survivors={pickOptions.options as Survivor[]}
          pickId={pickId}
          onPickChange={onPickChange}
        />
      );
    case PickOptionTypeEnum.Tribe:
      return (
        <TribePickOptions
          tribes={pickOptions.options as Tribe[]}
          pickId={pickId}
          onPickChange={onPickChange}
        />
      );
    default:
      return null;
  }
};

const BinaryPickOptions: React.FC<{
  pickOptions: Pick['pickOptions'];
  pickId: string;
  onPickChange: (pickId: string, playerChoice: string | null) => void;
}> = ({ pickOptions, pickId, onPickChange }) => {
  const [selectedOption, setSelectedOption] =
    useState<BinaryOptionsEnum | null>(null);

  const handleOptionChange = (option: BinaryOptionsEnum) => {
    setSelectedOption(option);
    onPickChange(pickId, option);
  };

  return (
    <div className='flex space-x-4 justify-center'>
      <div className='flex flex-col w-full space-y-2 items-center justify-center'>
        <Button
          onClick={() => handleOptionChange(BinaryOptionsEnum.True)}
          className={`w-full p-2 rounded-md ${ButtonPrimaryColors}`}>
          Yes
        </Button>
        <SelectedIcon isSelected={selectedOption === BinaryOptionsEnum.True} />
      </div>
      <div className='flex flex-col w-full space-y-2 items-center justify-center'>
        <Button
          className={`w-full p-2 rounded-md ${ButtonPrimaryColors}`}
          onClick={() => handleOptionChange(BinaryOptionsEnum.False)}>
          No
        </Button>
        <SelectedIcon isSelected={selectedOption === BinaryOptionsEnum.False} />
      </div>
    </div>
  );
};

const ColorPickOptions: React.FC<{
  colors: Color[];
  pickId: string;
  onPickChange: (pickId: string, playerChoice: string | null) => void;
}> = ({ colors, pickId, onPickChange }) => {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const handleColorChange = (color: Color) => {
    setSelectedColor(color);
    onPickChange(pickId, color.hex);
  };

  return (
    <div className='flex flex-row space-x-2 overflow-x-auto items-center justify-between'>
      {colors.map((color) => {
        let isSelected = false;
        if (selectedColor && selectedColor.hex === color.hex) {
          isSelected = true;
        }

        return (
          <div
            key={color.hex + '_' + Math.random()}
            className={`flex flex-col space-y-2 items-center justify-center min-w-16 h-24 rounded-md`}
            style={{
              backgroundColor: color.hex,
              opacity: isSelected ? 1.0 : 0.7,
            }}
            onClick={() => handleColorChange(color)}>
            <p
              className={`text-black font-bold ${
                isSelected ? 'underline' : ''
              }`}>
              {color.color}
            </p>
            <SelectedIcon className='w-6 h-6' isSelected={isSelected} />
          </div>
        );
      })}
    </div>
  );
};

const SurvivorPickOptions: React.FC<{
  survivors: Survivor[];
  pickId: string;
  onPickChange: (pickId: string, playerChoice: string | null) => void;
}> = ({ survivors, pickId, onPickChange }) => {
  const [selectedSurvivorId, setSelectedSurvivorId] = useState<
    Survivor['survivorId'] | null
  >(null);

  const handleSurvivorChange = (survivorId: string) => {
    setSelectedSurvivorId(survivorId);
    onPickChange(pickId, survivorId);
  };

  return (
    <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4'>
      {survivors.map((survivor) => {
        return (
          <div
            key={survivor.survivorId}
            className={`flex flex-col items-center rounded-md`}
            style={{
              opacity: survivor.survivorId === selectedSurvivorId ? 1.0 : 0.7,
            }}
            onClick={() => handleSurvivorChange(survivor.survivorId)}>
            <SurvivorImage
              seasonId={47}
              survivorName={survivor.firstName}
              survivorId={survivor.survivorId}
              className='w-16 h-16'
            />
            <div className='flex flex-col font-semibold text-center mt-2'>
              <h2>{survivor.firstName}</h2>
              <h2>{survivor.lastName}</h2>
            </div>
            <SelectedIcon
              className='w-10 h-10 p-2'
              isSelected={survivor.survivorId === selectedSurvivorId}
            />
          </div>
        );
      })}
    </div>
  );
};

const TribePickOptions: React.FC<{
  tribes: Tribe[];
  pickId: string;
  onPickChange: (pickId: string, playerChoice: string | null) => void;
}> = ({ tribes, pickId, onPickChange }) => {
  const preMergeTribes = tribes.filter((tribe) => !tribe.isMergeTribe);
  const [selectedTribe, setSelectedTribe] = useState<Tribe | null>(null);

  const handleTribeChange = (tribe: Tribe) => {
    setSelectedTribe(tribe);
    onPickChange(pickId, tribe.id);
  };

  return (
    <div className='flex flex-row items-center justify-between space-x-4'>
      {preMergeTribes.map((tribe) => {
        return (
          <div
            key={tribe.id}
            onClick={() => handleTribeChange(tribe)}
            className={`w-full items-center flex flex-col space-y-0 shadow-none rounded-sm`}
            style={{
              backgroundColor: tribe.color.hex,
              opacity: tribe.id === selectedTribe?.id ? 1.0 : 0.7,
            }}>
            <div className='p-2 rounded-md'>
              <TribeImage seasonId={tribe.seasonId} tribeId={tribe.id} />
            </div>
            <h2 className='text-center text-black text-2xl font-bold pt-2 pb-4'>
              {tribe.name}
            </h2>
            <SelectedIcon
              className='w-8 h-8 pb-2'
              isSelected={tribe.id === selectedTribe?.id}
            />
          </div>
        );
      })}
    </div>
  );
};
