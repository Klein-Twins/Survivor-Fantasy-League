import React, { useState } from 'react';
import { Episode } from '../../../../generated-api';
import { Button } from '@headlessui/react';
import {
  ButtonPrimaryColors,
  ButtonSubtleColors,
} from '../../../styles/CommonColorClassNames';
import EpisodeDisplay from './EpisodeDisplay';

interface AdminEpisodesProps {
  episodes: Episode[];
}

const AdminEpisodes: React.FC<AdminEpisodesProps> = ({ episodes }) => {
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(episodes[0].id);
  const selectedEpisode = episodes.find((e) => e.id === selectedEpisodeId);

  if (!selectedEpisode) {
    return null;
  }

  return (
    <div className='flex flex-col space-y-4'>
      <EpisodeSelectButtons
        episodes={episodes}
        selectedEpisode={selectedEpisodeId}
        setSelectedEpisode={setSelectedEpisodeId}
      />
      <EpisodeDisplay episode={selectedEpisode} />
    </div>
  );
};

interface EpisodeSelectButtonsProps {
  episodes: Episode[];
  selectedEpisode: Episode['id'];
  setSelectedEpisode: (id: Episode['id']) => void;
}

const EpisodeSelectButtons: React.FC<EpisodeSelectButtonsProps> = ({
  episodes,
  selectedEpisode,
  setSelectedEpisode,
}) => {
  return (
    <div className='flex flex-row space-x-2 overflow-x-auto w-full pb-4'>
      {episodes.map((episode) => {
        return (
          <Button
            key={episode.id}
            onClick={() => setSelectedEpisode(episode.id)}
            className={`${
              episode.id === selectedEpisode
                ? ButtonPrimaryColors
                : ButtonSubtleColors
            } px-4 py-2 rounded-lg whitespace-nowrap`}>
            Episode {episode.episodeNumber}
          </Button>
        );
      })}
    </div>
  );
};

export default AdminEpisodes;
