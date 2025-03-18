import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import React, { useState } from 'react';
import { Season } from '../../../generated-api';
import { setSelectedSeason } from '../../store/slices/seasonSlice';
import { FaTimes } from 'react-icons/fa';

const SeasonBanner: React.FC = () => {
  const seasonState = useSelector((state: RootState) => state.season);
  const dispatch = useDispatch<AppDispatch>();

  const [isChangingSeason, setIsChangingSeason] = useState<boolean>(false);

  const handleSeasonSelect = (seasonId: Season['id']) => {
    const selectedSeason = seasonState.seasons.find(
      (season) => season.id === seasonId
    );
    if (selectedSeason) {
      dispatch(setSelectedSeason(selectedSeason));
    }
    setIsChangingSeason(false);
  };

  const startDateFormatted = seasonState.selectedSeason?.startDate
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(new Date(seasonState.selectedSeason.startDate))
    : '';

  const endDateFormatted = seasonState.selectedSeason?.endDate
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(new Date(seasonState.selectedSeason.endDate))
    : '';

  return (
    <div className='min-h-44 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row justify-between items-center'>
      <div className='flex flex-col items-start'>
        <h1 className='text-3xl md:text-4xl font-bold mb-2'>
          Season: {seasonState.selectedSeason?.id || 'None'}
        </h1>
        <p className='text-lg md:text-xl text-gray-200'>
          {seasonState.selectedSeason?.name || 'Select a season to get started'}
        </p>
        <p className='text-lg md:text-xl text-gray-200'>
          {startDateFormatted} - {endDateFormatted}
        </p>
      </div>
      <div className='mt-4 md:mt-0'>
        {!isChangingSeason ? (
          <button
            onClick={() => setIsChangingSeason(true)}
            className='bg-white text-blue-600 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300'>
            Change Season
          </button>
        ) : (
          <SeasonSelectionBar
            seasons={seasonState.seasons}
            onSelectSeason={handleSeasonSelect}
            onClose={() => setIsChangingSeason(false)}
          />
        )}
      </div>
    </div>
  );
};

interface SeasonSelectionBarProps {
  seasons: Season[];
  onSelectSeason: (seasonId: Season['id']) => void;
  onClose: () => void;
}

const SeasonSelectionBar: React.FC<SeasonSelectionBarProps> = ({
  seasons,
  onSelectSeason,
  onClose,
}) => {
  return (
    <div className='bg-white text-gray-800 rounded-lg shadow-lg p-4 flex flex-col space-y-4 w-64'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-center'>Select a Season</h2>
        <FaTimes onClick={onClose} className='text-xl hover:opacity-60' />
      </div>
      <div className='flex justify-normal gap-4 overflow-x-auto'>
        {seasons.map((season) => (
          <>
            <button
              key={season.id}
              onClick={() => onSelectSeason(season.id)}
              className='bg-blue-500 text-white hover:bg-blue-600 font-medium py-2 px-4 rounded-lg shadow-md transition duration-300'>
              {season.id}
            </button>
          </>
        ))}
      </div>
    </div>
  );
};

export default SeasonBanner;
