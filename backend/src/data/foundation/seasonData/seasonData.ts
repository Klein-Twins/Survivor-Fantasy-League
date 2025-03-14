import { SeasonsAttributes } from '../../../models/season/Seasons';
import season48EpisodeData from './48/episodeData';

const seasonData: SeasonsAttributes[] = [
  {
    seasonId: 47,
    theme: 'The New Era 2.0',
    location: 'Fiji, Oceania',
    name: 'The first season of the new era',
    startDate: new Date('2024-09-13'),
    endDate: new Date('2024-12-20'),
    isActive: false,
  },
  {
    seasonId: 48,
    theme: 'The New Era 2.0',
    name: 'Survivor 48',
    location: 'Mamanuca Islands, Fiji',
    startDate: season48EpisodeData[0].episodeAirDate,
    endDate: season48EpisodeData[season48EpisodeData.length - 1].episodeAirDate,
    isActive: true,
  },
];

export default seasonData;
