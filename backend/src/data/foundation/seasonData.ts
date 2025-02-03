import { UUID } from 'crypto';
import { EpisodeAttributes } from '../../models/season/SSN_EPISODES';
import { SeasonsAttributes } from '../../models/Seasons';

const seasonData: SeasonsAttributes[] = [
  {
    seasonId: 47,
    theme: 'The New Era 2.0',
    location: 'Fiji, Oceania',
    name: 'The first season of the new era',
    startDate: new Date('2024-09-13'),
    endDate: new Date('2024-12-20'),
  },
];
type EpisodeKeys = `episode${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14}`;

export const season47EpisodeIds: Record<EpisodeKeys, UUID> = {
  episode1: '7d9c4e1a-8b2f-4c3d-9e5a-6f1b8c7d9e0f',
  episode2: 'a2b3c4d5-e6f7-8901-2345-678901abcdef',
  episode3: 'b3c4d5e6-f7a8-9012-3456-789012abcdef',
  episode4: 'c4d5e6f7-89a0-1234-5678-90123abcdef4',
  episode5: 'd5e6f7a8-90b1-2345-6789-012345abcdef',
  episode6: 'e6f7a8b9-0123-4567-89cd-123456abcdef',
  episode7: 'f7a8b9c0-1234-5678-90ef-234567abcdef',
  episode8: 'a8b9c0d1-2345-6789-01ab-345678abcdef',
  episode9: 'b9c0d1e2-3456-7890-12cd-456789abcdef',
  episode10: 'd6f57df4-4ecf-40bd-a170-ad8766bcdf07',
  episode11: '5a091fbd-53d8-4e03-9b9a-a855afe38105',
  episode12: '64ee948b-0542-4c14-b2b0-66b39de468a9',
  episode13: '66653c70-e999-44d3-970b-1e932b798561',
  episode14: '5b4bbc08-5600-41d8-a1b9-263ffee88b8c',
};

const episodeData: EpisodeAttributes[] = [
  {
    episodeId: season47EpisodeIds.episode1,
    seasonId: 47,
    episodeNumber: 1,
    episodeTitle: 'One Glourious and Perfect Episode',
    episodeAirDate: new Date('2024-09-18'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/1.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode2,
    seasonId: 47,
    episodeNumber: 2,
    episodeTitle: 'Epic Boss Girl Move',
    episodeAirDate: new Date('2024-09-25'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/2.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode3,
    seasonId: 47,
    episodeNumber: 3,
    episodeTitle: 'Belly of the Beast',
    episodeAirDate: new Date('2024-10-02'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/3.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode4,
    seasonId: 47,
    episodeNumber: 4,
    episodeTitle: 'Is That Blood in Your Hair?',
    episodeAirDate: new Date('2024-10-09'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/4.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode5,
    seasonId: 47,
    episodeNumber: 5,
    episodeTitle: 'The Scales be Tippin',
    episodeAirDate: new Date('2024-10-16'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/5.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode6,
    seasonId: 47,
    episodeNumber: 6,
    episodeTitle: 'Feel the FOMO',
    episodeAirDate: new Date('2024-10-23'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/6.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode7,
    seasonId: 47,
    episodeNumber: 7,
    episodeTitle: 'Our Pick on Blast',
    episodeAirDate: new Date('2024-10-30'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/7.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode8,
    seasonId: 47,
    episodeNumber: 8,
    episodeTitle: "He's All That",
    episodeAirDate: new Date('2024-12-06'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/8.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode9,
    seasonId: 47,
    episodeNumber: 9,
    episodeTitle: 'Nightmare Fuel',
    episodeAirDate: new Date('2024-11-13'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/9.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode10,
    seasonId: 47,
    episodeNumber: 10,
    episodeTitle: 'Loyal to the Soil',
    episodeAirDate: new Date('2024-11-20'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/10.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode11,
    seasonId: 47,
    episodeNumber: 11,
    episodeTitle: 'Flipping the Win Switch',
    episodeAirDate: new Date('2024-11-27'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/11.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode12,
    seasonId: 47,
    episodeNumber: 12,
    episodeTitle: 'Operation: Italy',
    episodeAirDate: new Date('2024-12-04'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/12.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode13,
    seasonId: 47,
    episodeNumber: 13,
    episodeTitle: 'Bob and Weave',
    episodeAirDate: new Date('2024-12-11'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/13.jpg',
  },
  {
    episodeId: season47EpisodeIds.episode14,
    seasonId: 47,
    episodeNumber: 14,
    episodeTitle: 'The Last Stand',
    episodeAirDate: new Date('2024-12-18'),
    episodeDescription: '',
    episodeImageUrl: 'episodes/47/14.jpg',
  },
];

const seasonAndEpisodeData = {
  seasonData,
  episodeData,
};

export default seasonAndEpisodeData;
