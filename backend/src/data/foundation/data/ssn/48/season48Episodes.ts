import { SeedEpisode, SeedEpisodes } from '../dataTypes';
import season48Episode1 from './season48Episode1';
import season48Episode2 from './season48Episode2';
import season48Episode3 from './season48Episode3';

const season48Episodes: SeedEpisodes = new Map<number, SeedEpisode>([
  [1, season48Episode1],
  [2, season48Episode2],
  [3, season48Episode3],
]);

export default season48Episodes;
