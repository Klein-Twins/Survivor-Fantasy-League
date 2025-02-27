import { TribeAttributes } from '../../../../models/season/Tribes';
import { season47TribeIds } from '../../foundationIds';

const season47TribeData: TribeAttributes[] = [
  {
    id: season47TribeIds.Gata,
    name: 'Gata',
    seasonId: 47,
    tribeColor: 'Yellow',
    mergeTribe: false,
  },
  {
    id: season47TribeIds.Tuku,
    name: 'Tuku',
    seasonId: 47,
    tribeColor: 'Blue',
    mergeTribe: false,
  },
  {
    id: season47TribeIds.Lavo,
    name: 'Lavo',
    seasonId: 47,
    tribeColor: 'Red',
    mergeTribe: false,
  },
  {
    id: season47TribeIds.Beka,
    name: 'Beka',
    seasonId: 47,
    tribeColor: 'Purple',
    mergeTribe: true,
  },
];

export default season47TribeData;
