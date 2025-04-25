import { v4 } from 'uuid';
import { EpisodeType } from '../../../../../generated-api';
import { SeedEpisode } from '../dataTypes';
import { UUID } from 'crypto';
import { season48SurvivorIds, season48TribeIds } from './ids';

const season48Episode4: SeedEpisode = {
  episodeInfo: {
    number: 4,
    id: '1caf174c-25df-4d47-ba67-6b8e3ee51ed3',
    title: "The House Party's Over",
    airDate: new Date('2025-03-19T19:00:00-06:00'),
    description:
      'An unexpected twist for the castaways sends the trajectory of their games into an all-new direction; an undercover alliance in the losing tribe leads to a shocking tribal council.',
    type: EpisodeType.PREMERGE,
  },
  episodeEvents: {
    tribalCouncil: [
      {
        day: 9,
        eliminatedSurvivorId: season48SurvivorIds.ThomasKrottinger,
        attendingTribeId: season48TribeIds.Vula,
        seq: 1,
        id: v4() as UUID,
        attendingSurvivorIds: null,
      },
    ],
    tribeSwitch: [
      {
        tribeId: season48TribeIds.Vula,
        survivorId: season48SurvivorIds.KyleFraser,
      },
      {
        tribeId: season48TribeIds.Vula,
        survivorId: season48SurvivorIds.KamillaKarthigesu,
      },
      {
        tribeId: season48TribeIds.Lagi,
        survivorId: season48SurvivorIds.DavidKinne,
      },
      {
        tribeId: season48TribeIds.Lagi,
        survivorId: season48SurvivorIds.CharityNeims,
      },
      {
        tribeId: season48TribeIds.Vula,
        survivorId: season48SurvivorIds.ThomasKrottinger,
      },
      {
        tribeId: season48TribeIds.Vula,
        survivorId: season48SurvivorIds.ShauhinDavari,
      },
      {
        tribeId: season48TribeIds.Vula,
        survivorId: season48SurvivorIds.JoeHunter,
      },
      {
        tribeId: season48TribeIds.Civa,
        survivorId: season48SurvivorIds.BiancaRoses,
      },
      {
        tribeId: season48TribeIds.Civa,
        survivorId: season48SurvivorIds.SaiouniaHughley,
      },
      {
        tribeId: season48TribeIds.Civa,
        survivorId: season48SurvivorIds.CedrekMcFadden,
      },
      {
        tribeId: season48TribeIds.Lagi,
        survivorId: season48SurvivorIds.MaryZheng,
      },
    ],
  },
};

export default season48Episode4;
