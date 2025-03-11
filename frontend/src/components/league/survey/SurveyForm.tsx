import React, { useState } from 'react';
import {
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

  return (
    <div className='flex flex-col space-y-4 px-4'>
      {picks.map((pick) => {
        return <FormPickInput key={pick.id} pick={pick} />;
      })}
      <Button
        onClick={() => onSubmit(picksWithPlayerChoice)}
        className={`w-full p-2 rounded-md ${ButtonPrimaryColors}`}>
        Submit
      </Button>
    </div>
  );
};

export default SurveyForm;

interface FormPickInputProps {
  pick: Pick;
}
const FormPickInput: React.FC<FormPickInputProps> = ({ pick }) => {
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
        />
      </div>
    </div>
  );
};

interface FormPickOptionsProps {
  pickOptionType: Pick['pickOptionType'];
  pickOptions: Pick['pickOptions'];
}

const FormPickOptions: React.FC<FormPickOptionsProps> = ({
  pickOptionType,
  pickOptions,
}) => {
  switch (pickOptionType) {
    case PickOptionTypeEnum.Binary:
      return <BinaryPickOptions pickOptions={pickOptions} />;
    case PickOptionTypeEnum.Color:
      return <ColorPickOptions colors={pickOptions.options as Color[]} />;
    case PickOptionTypeEnum.Survivor:
      return (
        <SurvivorPickOptions survivors={pickOptions.options as Survivor[]} />
      );
    case PickOptionTypeEnum.Tribe:
      return <TribePickOptions tribes={pickOptions.options as Tribe[]} />;
    default:
      return null;
  }
};

const BinaryPickOptions: React.FC<{ pickOptions: Pick['pickOptions'] }> = ({
  pickOptions,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  return (
    <div className='flex space-x-4 justify-center'>
      <div className='flex flex-col w-full space-y-2 items-center justify-center'>
        <Button
          onClick={() => setSelectedOption('yes')}
          className={`w-full p-2 rounded-md ${ButtonPrimaryColors}`}>
          Yes
        </Button>
        <SelectedIcon isSelected={selectedOption === 'yes'} />
      </div>
      <div className='flex flex-col w-full space-y-2 items-center justify-center'>
        <Button
          className={`w-full p-2 rounded-md ${ButtonPrimaryColors}`}
          onClick={() => setSelectedOption('no')}>
          No
        </Button>
        <SelectedIcon isSelected={selectedOption === 'no'} />
      </div>
    </div>
  );
};

const ColorPickOptions: React.FC<{ colors: Color[] }> = ({ colors }) => {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
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
            onClick={() => setSelectedColor(color)}>
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

const SurvivorPickOptions: React.FC<{ survivors: Survivor[] }> = ({
  survivors,
}) => {
  const [selectedSurvivorId, setSelectedSurvivorId] = useState<
    Survivor['survivorId'] | null
  >(null);

  return (
    <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4'>
      {survivors.map((survivor) => {
        return (
          <div
            className={`flex flex-col items-center rounded-md`}
            style={{
              opacity: survivor.survivorId === selectedSurvivorId ? 1.0 : 0.7,
            }}
            onClick={() => setSelectedSurvivorId(survivor.survivorId)}>
            <SurvivorImage
              seasonId={47}
              survivorName={survivor.firstName}
              key={survivor.survivorId}
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

const TribePickOptions: React.FC<{ tribes: Tribe[] }> = ({ tribes }) => {
  const preMergeTribes = tribes.filter((tribe) => !tribe.isMergeTribe);
  const [selectedTribe, setSelectedTribe] = useState<Tribe | null>(null);

  return (
    <div className='flex flex-row items-center justify-between space-x-4'>
      {preMergeTribes.map((tribe) => {
        return (
          <div
            onClick={() => setSelectedTribe(tribe)}
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
