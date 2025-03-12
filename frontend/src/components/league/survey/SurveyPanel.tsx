import React, { useState } from 'react';
import { Account, Episode, League, Profile } from '../../../../generated-api';
import {
  ButtonPrimaryColors,
  ButtonSubtleColors,
} from '../../../styles/CommonColorClassNames';
import Survey from './Survey';

interface SurveyPanelProps {
  league: League;
  account: Account;
}

const SurveyPanel: React.FC<SurveyPanelProps> = ({ league, account }) => {
  const [activeEpisode, setActiveEpisode] = useState<Episode>(
    league.season.episodes[0]
  );

  return (
    <div className='flex flex-col space-y-8 dark:bg-surface-a1-dark rounded-lg shadow-lg p-4'>
      <div className='dark:bg-surface-a2-dark p-2'>
        <EpisodePagination
          activeEpisode={activeEpisode}
          setActiveEpisode={setActiveEpisode}
          episodes={league.season.episodes}
        />
      </div>
      <div className='dark:bg-surface-a2-dark p-2'>
        <Survey
          episodeId={activeEpisode.id}
          profileId={account.profileId}
          leagueId={league.leagueId}
        />
      </div>
    </div>
  );
};

export default SurveyPanel;

interface EpisodePaginationProps {
  activeEpisode: Episode;
  setActiveEpisode: (episode: Episode) => void;
  episodes: Episode[];
}

const EpisodePagination: React.FC<EpisodePaginationProps> = ({
  activeEpisode,
  setActiveEpisode,
  episodes,
}) => {
  const currentIndex = episodes.findIndex(
    (episode) => episode.id === activeEpisode.id
  );

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setActiveEpisode(episodes[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < episodes.length - 1) {
      setActiveEpisode(episodes[currentIndex + 1]);
    }
  };

  return (
    <div className='flex justify-center items-center space-x-2 py-2'>
      <button
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className={`px-3 py-1 rounded-md mb-3 md:mb-0 ${ButtonSubtleColors}`}>
        &lt;
      </button>
      <div className='flex space-x-2 overflow-x-auto mb-3 md:mb-0'>
        {episodes.map((episode, index) => (
          <button
            key={episode.id}
            onClick={() => setActiveEpisode(episode)}
            className={`px-3 py-1 rounded-md ${
              index === currentIndex ? ButtonPrimaryColors : ButtonSubtleColors
            }`}>
            {index + 1}
          </button>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={currentIndex === episodes.length - 1}
        className={`px-3 py-1 rounded-md mb-3 md:mb-0 ${
          currentIndex === episodes.length - 1
            ? ButtonPrimaryColors
            : ButtonSubtleColors
        }`}>
        &gt;
      </button>
    </div>
  );
};
