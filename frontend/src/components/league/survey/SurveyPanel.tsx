import React, { useEffect, useState } from 'react';
import {
  Episode,
  GetLeagueMemberSurveysResponse,
  League,
  LeagueMemberSurvey,
  Profile,
} from '../../../../generated-api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import Survey from './Survey';

import 'swiper/swiper-bundle.css';

import './SurveyPanel.css';
import EpisodeSwiper from './EpisodeSwiper';
import { useApi } from '../../../hooks/useApi';
import surveyService, {
  GetLeagueSurveysRequestParams,
} from '../../../services/league/survey/surveyService';
import LoadingData from '../../ui/LoadingData';
import {
  getSurveys,
  setCurrentSurvey,
} from '../../../store/slices/surveySlice';

interface SurveyPanelProps {
  leagueId: League['id'];
  profileId: Profile['profileId'];
}

const SurveyPanel: React.FC<SurveyPanelProps> = ({ leagueId, profileId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { surveys, getSurveysError, getSurveysLoading, currentSurvey } =
    useSelector((state: RootState) => state.survey);
  const currentSeason = useSelector(
    (state: RootState) => state.season.selectedSeason
  );

  const activeEpisode = useSelector(
    (state: RootState) => state.season.activeEpisode || null
  );

  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(
    activeEpisode
      ? activeEpisode
      : currentSeason.episodes.length > 1
      ? currentSeason.episodes[currentSeason.episodes.length - 1]
      : null
  );

  const handleEpisodeChange = (episode: Episode) => {
    setSelectedEpisode(episode);
    const selectedSurvey = surveys.find(
      (survey) => survey.episodeId === episode.id
    );
    dispatch(setCurrentSurvey(selectedSurvey || null));
  };

  useEffect(() => {
    dispatch(
      getSurveys({
        queryParams: {
          leagueId,
          profileId,
        },
      })
    );
  }, []);

  if (getSurveysLoading) {
    return (
      <div className='flex flex-col w-full justify-center bg-surface-a5-light dark:bg-surface-a5-dark p-2 rounded-md'>
        <LoadingData text='Loading Surveys' />
      </div>
    );
  }

  if (!surveys || surveys.length === 0) {
    return (
      <div className='flex flex-col w-full justify-center bg-surface-a5-light dark:bg-surface-a5-dark p-2 rounded-md'>
        <h1 className='text-center text-4xl font-bold py-2'>No Surveys</h1>
      </div>
    );
  }

  const panelBackgroundColor =
    'dark:bg-surface-a5-dark bg-surface-a5-light dark:text-white text-black';

  return (
    <div
      className={`flex flex-col w-full justify-center ${panelBackgroundColor} p-2 rounded-md`}>
      {/* <h1 className='text-center text-4xl font-bold py-2'>Your Surveys</h1> */}
      <EpisodeSwiper
        episodes={currentSeason.episodes}
        selectedEpisode={selectedEpisode}
        surveys={surveys} // Pass the extracted array of surveys
        onSelect={handleEpisodeChange}
      />
      {currentSurvey && <Survey survey={currentSurvey} />}
    </div>
  );
};

export default SurveyPanel;
