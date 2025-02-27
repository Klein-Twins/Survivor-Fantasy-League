import React from 'react';
import SeasonSelect from './SeasonSelect';
import { TextPrimaryColor, TextSecondaryColor } from '../../styles/CommonColorClassNames';

const availableSeasons: number[] = [
  47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19,
  18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
];

interface SurvivorCastHeaderProps {
  selectedSeason: string | number;
  setSelectedSeason: (season: number) => void;
}

const SurvivorCastHeader: React.FC<SurvivorCastHeaderProps> = ({ selectedSeason, setSelectedSeason }) => {
  return (
    <div className='flex justify-between items-center mx-8 pt-4 pb-8'>
      <div>
        <h2 className={`text-4xl font-semibold ${TextPrimaryColor}`}>Survivor Cast</h2>
        <p className={`${TextSecondaryColor} mt-2`}>Season {selectedSeason} Castaways</p>
      </div>
      <SeasonSelect seasons={availableSeasons} onSeasonChange={setSelectedSeason} />
    </div>
  );
};

export default SurvivorCastHeader;
