import React, { useState } from 'react';
import SurveyForm from './SurveyForm';
import { Button } from '@headlessui/react';
import { Account, Episode, League, Season } from '../../../../generated-api';
import {
  ButtonPrimaryColors,
  ButtonSubtleColors,
} from '../../../styles/CommonColorClassNames';

interface SurveyPanelProps {
  account: Account;
  league: League;
}

const SurveyPanel: React.FC<SurveyPanelProps> = ({ account, league }) => {
  const [activeEpisode, setActiveEpisode] = useState<Episode>(
    league.season.episodes[0]
  );

  return (
    <div className='bg-surface-a1-dark rounded-lg shadow-lg'>
      <h1 className='text-center text-3xl py-2 font-bold'>Surveys</h1>
      <EpisodeSelectBar
        activeEpisode={activeEpisode}
        setActiveEpisode={setActiveEpisode}
        episodes={league.season.episodes}
      />
      <SurveyForm
        episodeId={activeEpisode.id}
        profileId={account.profileId}
        leagueId={league.leagueId}
      />
      {/* <SurveyForm episodeNumber={activeEpisode} /> */}
    </div>
  );
};

export default SurveyPanel;

interface EpisodeSelectBarProps {
  activeEpisode: Episode;
  setActiveEpisode: (episode: Episode) => void;
  episodes: Episode[];
}

const EpisodeSelectBar: React.FC<EpisodeSelectBarProps> = ({
  activeEpisode,
  setActiveEpisode,
  episodes,
}) => {
  return (
    <div className='bg-surgace-a1-light dark:bg-surface-a1-dark flex space-x-2 overflow-x-auto whitespace-nowrap'>
      {episodes.map((episode) => {
        return (
          <Button
            key={episode.id}
            onClick={() => setActiveEpisode(episode)}
            className={`${
              activeEpisode.id === episode.id
                ? ButtonPrimaryColors
                : ButtonSubtleColors
            } p-2 rounded-lg`}>
            Episode {episode.episodeNumber}
          </Button>
        );
      })}
    </div>
  );
};
