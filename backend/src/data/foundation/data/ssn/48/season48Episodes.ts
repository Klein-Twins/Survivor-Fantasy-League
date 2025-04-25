import { SeedEpisode, SeedEpisodes } from '../dataTypes';
import season48Episode1 from './season48Episode1';
import season48Episode2 from './season48Episode2';
import season48Episode3 from './season48Episode3';
import season48Episode4 from './season48Episode4';
import season48Episode5 from './season48Episode5';
import season48Episode6 from './season48Episode6';
import season48Episode7 from './season48Episode7';
import season48Episode8 from './season48Episode8';
import season48Episode9 from './season48Episode9';

const season48Episodes: SeedEpisodes = new Map<number, SeedEpisode>([
  [1, season48Episode1],
  [2, season48Episode2],
  [3, season48Episode3],
  [4, season48Episode4],
  [5, season48Episode5],
  [6, season48Episode6],
  [7, season48Episode7],
  [8, season48Episode8],
  [9, season48Episode9],
]);

export default season48Episodes;
