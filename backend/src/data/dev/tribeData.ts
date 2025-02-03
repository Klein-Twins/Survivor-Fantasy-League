import { UUID } from 'crypto';
import { TribeAttributes } from '../../models/season/SSN_TRIBES';

type TribeName = 'Gata' | 'Tuku' | 'Lavo' | 'Beka';

export const season47TribeIds: Record<TribeName, UUID> = {
  Gata: '7f833e71-de61-4588-8085-ee75f4542317',
  Tuku: '0a4c2896-3013-4639-a54e-1a26f90dae25',
  Lavo: '050bbc42-e239-405d-997e-96c2dd0c308d',
  Beka: 'e82fd9fc-3bef-4f0d-b1cf-131ea8397662',
};

const tribes: TribeAttributes[] = [
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

const tribeData = {
  tribes,
};

export default tribeData;
