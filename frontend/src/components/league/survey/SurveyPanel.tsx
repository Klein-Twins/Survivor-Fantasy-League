import { useState } from 'react';
import SurveyForm from './SurveyForm';

const SurveyPanel = () => {
  const [activeEpisode, setActiveEpisode] = useState(1);
  const episodes = Array.from({ length: 14 }, (_, i) => i + 1);

  return (
    <div className='bg-surface-a1-dark rounded-lg shadow-lg'>
      <div
        className='overflow-x-auto scrollbar-thin scrollbar-track-surface-a2-dark scrollbar-thumb-primary'
        style={{}}>
        <div className='flex space-x-1 mb-2'>
          {episodes.map((episode) => (
            <button
              key={episode}
              onClick={() => setActiveEpisode(episode)}
              className={`
                    px-4 py-2 
                    min-w-[100px]
                    text-sm font-medium
                    transition-all
                    rounded-t-lg
                    dark:hover:bg-surface-a2-dark
                    ${
                      activeEpisode === episode
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }
                  `}>
              Episode {episode}
            </button>
          ))}
        </div>
      </div>
      <SurveyForm episodeNumber={activeEpisode} />
    </div>
  );
};

export default SurveyPanel;
