import { TribeAttributes } from '../../../../models/season/Tribes';
import { season47EpisodeIds, season47TribeIds } from '../../foundationIds';

const season47TribeData: TribeAttributes[] = [
  {
    id: season47TribeIds.Gata,
    name: 'Gata',
    seasonId: 47,
    tribeColor: 'Yellow',
    mergeTribe: false,
    episodeStarted: season47EpisodeIds.episode1,
  },
  {
    id: season47TribeIds.Tuku,
    name: 'Tuku',
    seasonId: 47,
    tribeColor: 'Blue',
    mergeTribe: false,
    episodeStarted: season47EpisodeIds.episode1,
  },
  {
    id: season47TribeIds.Lavo,
    name: 'Lavo',
    seasonId: 47,
    tribeColor: 'Red',
    mergeTribe: false,
    episodeStarted: season47EpisodeIds.episode1,
  },
  {
    id: season47TribeIds.Beka,
    name: 'Beka',
    seasonId: 47,
    tribeColor: 'Purple',
    mergeTribe: true,
    episodeStarted: season47EpisodeIds.episode7,
  },
];

export default season47TribeData;
