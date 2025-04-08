import { TribeAttributes } from '../../../../models/season/Tribes';
import { season47EpisodeIds, season47TribeIds } from '../../foundationIds';

const season47TribeData: TribeAttributes[] = [
  {
    id: season47TribeIds.Gata,
    name: 'Gata',
    seasonId: 47,
    tribeColor: 'Yellow',
    tribeHexColor: '#FFD700',
    mergeTribe: false,
    episodeStarted: season47EpisodeIds.episode1,
  },
  {
    id: season47TribeIds.Tuku,
    name: 'Tuku',
    seasonId: 47,
    tribeColor: 'Blue',
    tribeHexColor: '#0000FF',
    mergeTribe: false,
    episodeStarted: season47EpisodeIds.episode1,
  },
  {
    id: season47TribeIds.Lavo,
    name: 'Lavo',
    seasonId: 47,
    tribeColor: 'Red',
    tribeHexColor: '#FF0000',
    mergeTribe: false,
    episodeStarted: season47EpisodeIds.episode1,
  },
  {
    id: season47TribeIds.Beka,
    name: 'Beka',
    seasonId: 47,
    tribeColor: 'Purple',
    tribeHexColor: '#800080',
    mergeTribe: true,
    episodeStarted: season47EpisodeIds.episode7,
  },
];

export default season47TribeData;
