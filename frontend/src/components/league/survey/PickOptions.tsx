import React, { useState } from 'react';
import {
  BinaryPickOptions,
  ColorPickOptions,
  PickOptionTypeEnum,
  Survivor,
  SurvivorPickOptions,
  TribePickOptions,
} from '../../../../generated-api';

interface PickOptionsProps {
  pickOptions: ColorPickOptions | TribePickOptions | SurvivorPickOptions | BinaryPickOptions;
  pickOptionType: PickOptionTypeEnum;
}
interface PickOptionsProps {
  pickOptions: ColorPickOptions | TribePickOptions | SurvivorPickOptions | BinaryPickOptions;
  pickOptionType: PickOptionTypeEnum;
  onSelect?: (value: string) => void;
}

const PickOptions: React.FC<PickOptionsProps> = ({ pickOptions, pickOptionType, onSelect }) => {
  const [selected, setSelected] = useState<string>('');

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect?.(value);
  };

  const renderColorOptions = (options: ColorPickOptions) => (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
      {options.options.map((color) => (
        <button
          key={color}
          onClick={() => handleSelect(color)}
          className={`
              p-3 rounded-lg text-left transition-all
              ${
                selected === color
                  ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                  : 'bg-surface-a2-dark hover:bg-surface-a3-dark'
              }
            `}>
          {color}
        </button>
      ))}
    </div>
  );

  const renderSurvivorOptions = (options: SurvivorPickOptions) => (
    <div className='flex w-full justify-center overflow-x-auto space-x-2'>
      {options.options.map((survivor: Survivor) => (
        <button
          key={survivor.survivorId}
          onClick={() => handleSelect(survivor.survivorId)}
          className={`
            p-3 min-w-24 rounded-lg text-center transition-all flex flex-col items-center
            ${
              selected === survivor.survivorId
                ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                : 'bg-surface-a2-dark hover:bg-surface-a3-dark'
            }
          `}>
          <div className='w-20 h-20 mb-2 overflow-hidden rounded-full'>
            <img
              src={`http://localhost:3000/${survivor.imageUrl}` || '/default-avatar.png'}
              alt={`${survivor.firstName} ${survivor.lastName}`}
              className='w-full h-full object-cover'
            />
          </div>
          {`${survivor.firstName} ${survivor.lastName}`}
        </button>
      ))}
    </div>
  );

  const renderTribeOptions = (options: TribePickOptions) => (
    <div className='flex justify-center w-full overflow-x-auto space-x-2 mx-auto'>
      {options.options.map((tribe) => (
        <button
          key={tribe.id}
          onClick={() => handleSelect(tribe.id)}
          className={`
              p-3 rounded-lg text-center min-w-24 transition-all
              ${
                selected === tribe.id
                  ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                  : 'bg-surface-a2-dark hover:bg-surface-a3-dark'
              }
            `}>
          {tribe.name}
        </button>
      ))}
    </div>
  );

  const renderBinaryOptions = () => (
    <div className='flex gap-4'>
      {['Yes', 'No'].map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option.toLowerCase())}
          className={`
              flex-1 p-3 rounded-lg text-center transition-all
              ${
                selected === option.toLowerCase()
                  ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                  : 'bg-surface-a2-dark hover:bg-surface-a3-dark'
              }
            `}>
          {option}
        </button>
      ))}
    </div>
  );

  switch (pickOptionType) {
    case PickOptionTypeEnum.Color:
      return renderColorOptions(pickOptions as ColorPickOptions);
    case PickOptionTypeEnum.Survivor:
      return renderSurvivorOptions(pickOptions as SurvivorPickOptions);
    case PickOptionTypeEnum.Tribe:
      return renderTribeOptions(pickOptions as TribePickOptions);
    case PickOptionTypeEnum.Binary:
      return renderBinaryOptions();
    default:
      return null;
  }
};

export default PickOptions;
