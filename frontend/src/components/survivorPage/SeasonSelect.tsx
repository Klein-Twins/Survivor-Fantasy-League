import { useState, useRef } from 'react';

interface SeasonSelectProps {
  seasons: number[];
  onSeasonChange: (season: number) => void;
}

const SeasonSelect: React.FC<SeasonSelectProps> = ({ seasons, onSeasonChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(seasons[0]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelectSeason = (season: number) => {
    setSelectedSeason(season);
    onSeasonChange(season);
    setIsOpen(false);
  };

  return (
    <div className='relative inline-block text-left'>
      <button
        ref={buttonRef}
        type='button'
        className='inline-flex justify-between items-center w-full rounded-md dark:border dark:border-surface-a1-dark dark:bg-surface-a2-dark py-2 px-4 text-sm font-medium hover:outline-none focus:outline-none'
        onClick={() => setIsOpen(!isOpen)}>
        <span className='text-left flex-1'>{selectedSeason ? `Season ${selectedSeason}` : 'Select Season'}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='ml-2 h-5 w-5'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'>
          <path
            fillRule='evenodd'
            d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{ width: buttonRef.current?.offsetWidth }}
          className='absolute right-0 mt-2 rounded-md shadow-lg dark:bg-surface-a2-dark z-10'
          onMouseLeave={() => setIsOpen(false)}>
          <div className='max-h-60 overflow-y-auto w-full'>
            <div className='py-1'>
              {seasons.map((season) => (
                <button
                  key={season}
                  onClick={() => handleSelectSeason(season)}
                  className='block w-full text-left px-4 py-2 text-sm dark:text-primary-a0-dark hover:bg-surface-a3-dark focus:outline-none'>
                  Season {season}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonSelect;
