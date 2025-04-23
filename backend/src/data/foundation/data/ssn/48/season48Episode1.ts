import { UUID } from 'crypto';
import { EpisodeType } from '../../../../../generated-api';
import { season48SurvivorIds, season48TribeIds } from './ids';
import { v4 as uuidv4 } from 'uuid';
import { SeedEpisode } from '../dataTypes';

const season48Episode1: SeedEpisode = {
  episodeInfo: {
    number: 1,
    id: '08a769c0-9e7f-49f6-a913-4a5061952b5d',
    title: 'THe Get to Know You Game',
    airDate: new Date('2025-02-26T19:00:00-06:00'),
    description: '',
    type: EpisodeType.PREMIERE,
  },
  episodeEvents: {
    tribeStart: [
      {
        id: season48TribeIds.Civa,
        name: 'Civa',
        color: 'Green',
        hexColor: '#008000',
        startingSurvivors: [
          season48SurvivorIds.CharityNeims,
          season48SurvivorIds.ChrissySarnowsky,
          season48SurvivorIds.DavidKinne,
          season48SurvivorIds.KyleFraser,
          season48SurvivorIds.MitchGuerra,
          season48SurvivorIds.KamillaKarthigesu,
        ],
      },
      {
        id: season48TribeIds.Lagi,
        name: 'Lagi',
        color: 'Blue',
        hexColor: '#0000FF',
        startingSurvivors: [
          season48SurvivorIds.EvaErickson,
          season48SurvivorIds.JoeHunter,
          season48SurvivorIds.ShauhinDavari,
          season48SurvivorIds.StarToomey,
          season48SurvivorIds.ThomasKrottinger,
          season48SurvivorIds.BiancaRoses,
        ],
      },
      {
        id: season48TribeIds.Vula,
        name: 'Vula',
        color: 'Orange',
        hexColor: '#FFA500',
        startingSurvivors: [
          season48SurvivorIds.CedrekMcFadden,
          season48SurvivorIds.JustinPioppi,
          season48SurvivorIds.KevinLeung,
          season48SurvivorIds.MaryZheng,
          season48SurvivorIds.SaiouniaHughley,
          season48SurvivorIds.StephanieBerger,
        ],
      },
    ],
    tribalCouncil: [
      {
        id: uuidv4() as UUID,
        day: 3,
        seq: 1,
        attendingTribeId: season48TribeIds.Vula,
        eliminatedSurvivorId: season48SurvivorIds.StephanieBerger,
        attendingSurvivorIds: null,
      },
    ],
  },
};

export default season48Episode1;
