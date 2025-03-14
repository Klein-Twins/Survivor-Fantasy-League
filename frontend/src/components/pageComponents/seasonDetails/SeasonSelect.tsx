import { useState } from 'react';
import { Season } from '../../../../generated-api';
import {
  ButtonPrimaryColors,
  ButtonSubtleColors,
} from '../../../styles/CommonColorClassNames';
import { FaChevronDown } from 'react-icons/fa';

interface SeasonOption {
  season: Season;
  label: string;
}

interface SeasonSelectProps {
  seasonOptions: SeasonOption[];
  onChangeSeason: (seasonId: Season['id']) => void;
  selectedSeason?: Season;
}

const SeasonSelect: React.FC<SeasonSelectProps> = ({
  seasonOptions,
  onChangeSeason,
  selectedSeason,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (optionValue: Season) => {
    onChangeSeason(optionValue.id);
    setIsOpen(false);
  };

  return (
    <div className='relative w-full'>
      <button
        className={`${ButtonSubtleColors} rounded-md text-center text-3xl font-bold px-4 py-2 cursor-pointer w-full`}
        onClick={() => setIsOpen(!isOpen)}>
        <div className='flex justify-center space-x-2 items-center'>
          <h1>
            {' '}
            {seasonOptions.find(
              (seasonOption) => seasonOption.season === selectedSeason
            )?.label || 'Select an option'}
          </h1>
          <FaChevronDown
            className={`text-xl ${
              isOpen
                ? 'rotate-180 transition-transform'
                : 'transition-transform'
            }`}
          />
        </div>
      </button>
      {isOpen && (
        <div className='z-10 mt-1 w-full'>
          {seasonOptions.map((option) => (
            <div
              key={option.season.id + Math.random()}
              className={`
                  ${
                    option.season === selectedSeason
                      ? ButtonPrimaryColors
                      : 'dark:bg-surface-a1-dark bg-surface-a1-light'
                  }
                  text-center text-2xl font-bold px-4 py-2 cursor-pointer w-full`}
              onClick={() => handleOptionClick(option.season)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeasonSelect;
