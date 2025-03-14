import React, { useState } from 'react';
import { Season } from '../../generated-api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import SeasonSelect from '../components/pageComponents/seasonDetails/SeasonSelect';
import SurvivorSection from '../components/pageComponents/seasonDetails/survivorSection/SurvivorSection';
import { getSeasons } from '../store/slices/seasonSlice';
const SeasonDetailsPage: React.FC = () => {
  const seasonState = useSelector((state: RootState) => state.season);

  const dispatch = useDispatch<AppDispatch>();
  if (seasonState.seasons.length === 0) {
    dispatch(getSeasons());
  }

  const [selectedSeason, setSelectedSeason] = useState<Season>(
    seasonState.activeSeason
  );

  const seasonOptions = seasonState.seasons.map((season) => ({
    season: season,
    label: `Season: ${season.id}`,
  }));

  function handleSeasonChange(seasonId: number) {
    setSelectedSeason(
      seasonState.seasons.find((season) => season.id === seasonId)
    );
  }

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='w-full md:w-1/2 px-2'>
        <SeasonSelect
          seasonOptions={seasonOptions}
          onChangeSeason={handleSeasonChange}
          selectedSeason={selectedSeason}
        />
      </div>
      <section className='w-full px-2'>
        <SurvivorSection
          seasonId={selectedSeason.id}
          survivors={selectedSeason.survivors}
        />
      </section>
    </div>
  );
};

export default SeasonDetailsPage;
