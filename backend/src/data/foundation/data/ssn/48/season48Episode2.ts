import { v4 } from 'uuid';
import { EpisodeType } from '../../../../../generated-api';
import { SeedEpisode } from '../dataTypes';
import { UUID } from 'crypto';
import { season48SurvivorIds, season48TribeIds } from './ids';

const season48Episode2: SeedEpisode = {
  episodeInfo: {
    number: 2,
    id: '72c20456-e744-4b40-b3ed-e9dc00d391d9',
    title: 'Humble Traits',
    airDate: new Date('2025-03-05T19:00:00-06:00'),
    description: '',
    type: EpisodeType.PREMERGE,
  },
  episodeEvents: {
    tribalCouncil: [
      {
        id: v4() as UUID,
        day: 5,
        seq: 1,
        attendingTribeId: season48TribeIds.Vula,
        eliminatedSurvivorId: season48SurvivorIds.KevinLeung,
        attendingSurvivorIds: null,
      },
    ],
  },
};

export default season48Episode2;
