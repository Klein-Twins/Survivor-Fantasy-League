import React from 'react';
import { Episode, League, Profile } from '../../../../generated-api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  ButtonPrimaryColors,
  ButtonSubtleColors,
} from '../../../styles/CommonColorClassNames';
import useSurvey from '../../../hooks/survey/useSurvey';
import Survey from './Survey';

interface SurveyPanelProps {
  leagueId: League['id'];
  profileId: Profile['profileId'];
}

const SurveyPanel: React.FC<SurveyPanelProps> = ({ leagueId, profileId }) => {
  const currentSeason = useSelector(
    (state: RootState) => state.season.selectedSeason
  );
  const activeEpisode = useSelector(
    (state: RootState) => state.season.activeEpisode
  );

  const {
    survey,
    isLoading: surveyIsLoading,
    error: surveyError,
    selectedEpisode,
    setSelectedEpisode,
  } = useSurvey({ leagueId, profileId, activeEpisode });

  const panelBackgroundColor =
    'dark:bg-surface-a5-dark bg-surface-a5-light dark:text-white text-black';

  return (
    <div
      className={`flex flex-col w-full justify-center ${panelBackgroundColor} p-2 rounded-md`}>
      <h1 className='text-center text-4xl font-bold py-2'>Your Surveys</h1>
      <EpisodeSelection
        episodes={currentSeason.episodes}
        selectedEpisode={selectedEpisode}
        onSelect={setSelectedEpisode}
      />
      <Survey
        survey={survey}
        surveyIsLoading={surveyIsLoading}
        surveyError={surveyError}
      />
    </div>
  );
};

export default SurveyPanel;

interface EpisodeSelectionProps {
  episodes: Episode[];
  selectedEpisode: Episode;
  onSelect: (episode: Episode) => void;
}
const EpisodeSelection: React.FC<EpisodeSelectionProps> = ({
  episodes,
  selectedEpisode,
  onSelect,
}) => {
  return (
    <div className='w-full overflow-x-auto flex space-x-4 items-center justify-center'>
      {episodes.map((episode) => {
        const buttonColors =
          selectedEpisode.id === episode.id
            ? ButtonPrimaryColors
            : ButtonSubtleColors;
        return (
          <div
            key={episode.id}
            onClick={() => onSelect(episode)}
            className={`min-w-24 py-2 ${buttonColors} rounded-md text-xl text-center text-white hover:cursor-pointer`}>
            Episode {episode.number}
          </div>
        );
      })}
    </div>
  );
};
