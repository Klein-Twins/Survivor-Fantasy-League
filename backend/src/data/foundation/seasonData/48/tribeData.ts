import { TribeAttributes } from '../../../../models/season/Tribes';
import { season48EpisodeIds, season48TribeIds } from '../../foundationIds';

const season48TribeData: TribeAttributes[] = [
  {
    id: season48TribeIds.Civa,
    name: 'Civa',
    seasonId: 48,
    tribeColor: 'Green',
    tribeHexColor: '#008000',
    mergeTribe: false,
    episodeStarted: season48EpisodeIds.episode1,
  },
  {
    id: season48TribeIds.Lagi,
    name: 'Lagi',
    seasonId: 48,
    tribeColor: 'Blue',
    tribeHexColor: '#0000FF',
    mergeTribe: false,
    episodeStarted: season48EpisodeIds.episode1,
  },
  {
    id: season48TribeIds.Vula,
    name: 'Vula',
    seasonId: 48,
    tribeColor: 'Orange',
    tribeHexColor: '#FFA500',
    mergeTribe: false,
    episodeStarted: season48EpisodeIds.episode1,
  },
];

export default season48TribeData;
