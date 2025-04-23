import { v4 } from 'uuid';
import { EpisodeType } from '../../../../../generated-api';
import { SeedEpisode } from '../dataTypes';
import { UUID } from 'crypto';
import { season48SurvivorIds, season48TribeIds } from './ids';

const season48Episode3: SeedEpisode = {
  episodeInfo: {
    number: 3,
    id: '4df12bba-1af8-4b7b-9583-17d7c7b61924',
    title: 'Committing to the Bit',
    airDate: new Date('2025-03-12T19:00:00-06:00'),
    description: '',
    type: EpisodeType.PREMERGE,
  },
  episodeEvents: {
    tribalCouncil: [
      {
        id: v4() as UUID,
        day: 7,
        seq: 1,
        attendingTribeId: season48TribeIds.Civa,
        eliminatedSurvivor: season48SurvivorIds.JustinPioppi,
      },
    ],
  },
};

export default season48Episode3;
