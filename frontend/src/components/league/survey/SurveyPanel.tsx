import React, { useState } from 'react';
import { Episode, League, Profile } from '../../../../generated-api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import Survey from './Survey';

import 'swiper/swiper-bundle.css';

import './SurveyPanel.css';
import EpisodeSwiper from './EpisodeSwiper';

interface SurveyPanelProps {
  leagueId: League['id'];
  profileId: Profile['profileId'];
}

const SurveyPanel: React.FC<SurveyPanelProps> = ({ leagueId, profileId }) => {
  const currentSeason = useSelector(
    (state: RootState) => state.season.selectedSeason
  );
  const activeEpisode = useSelector(
    (state: RootState) => state.season.activeEpisode || null
  );

  const initialEpisodeOnPageLoad: Episode | null =
    activeEpisode || currentSeason.episodes.length > 1
      ? currentSeason.episodes[currentSeason.episodes.length - 1]
      : null;

  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(
    initialEpisodeOnPageLoad
  );

  const panelBackgroundColor =
    'dark:bg-surface-a5-dark bg-surface-a5-light dark:text-white text-black';

  return (
    <div
      className={`flex flex-col w-full justify-center ${panelBackgroundColor} p-2 rounded-md`}>
      <h1 className='text-center text-4xl font-bold py-2'>Your Surveys</h1>
      <EpisodeSwiper
        episodes={currentSeason.episodes}
        selectedEpisode={selectedEpisode}
        onSelect={setSelectedEpisode}
      />
      <Survey
        leagueId={leagueId}
        profileId={profileId}
        activeEpisode={selectedEpisode}
      />
    </div>
  );
};

export default SurveyPanel;
