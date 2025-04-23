import { SeedSeasonData } from '../dataTypes';
import season48Episodes from './season48Episodes';

const season48Data: SeedSeasonData = {
  seasonId: 48,
  theme: 'The New Era 2.0',
  name: 'Survivor 48',
  location: 'Mamanuca Islands, Fiji',
  isActive: true,
  episodes: season48Episodes,
  startDate: season48Episodes.get(1)?.episodeInfo.airDate || null,
  endDate: null,
};

export default season48Data;
