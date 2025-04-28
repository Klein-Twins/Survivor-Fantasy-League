import { v4 } from 'uuid';
import { EpisodeType } from '../../../../../generated-api';
import { SeedEpisode } from '../dataTypes';
import { season48SurvivorIds, season48TribeIds } from './ids';
import { UUID } from 'crypto';

const season48Episode6: SeedEpisode = {
  episodeInfo: {
    number: 6,
    id: '49b0d820-0dc4-4b3f-b158-bee4a6b4d4be',
    title: 'Doing the Damn Thing',
    airDate: new Date('2025-04-02T19:00:00-06:00'),
    description:
      'A mad dash ensues when an opportunity to get ahead in the game lands on the beach; information is a free-for-all when players talk strategy over a reward meal.',
    type: EpisodeType.TRIBELESS,
  },
  episodeEvents: {
    merge: {
      id: season48TribeIds.Merge,
      name: 'Merge tbd',
      color: 'Blue',
      hexColor: '#0000FF',
      startingSurvivors: [],
    },
    tribalCouncil: [
      {
        attendingTribeId: null,
        attendingSurvivorIds: null,
        day: 13,
        eliminatedSurvivorId: season48SurvivorIds.CharityNeims,
        id: v4() as UUID,
        seq: 1,
      },
    ],
  },
};

export default season48Episode6;
