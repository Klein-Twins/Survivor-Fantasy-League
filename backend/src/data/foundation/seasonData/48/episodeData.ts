import { EpisodeType } from '../../../../generated-api';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { season48EpisodeIds } from '../../foundationIds';

const season48EpisodeData: EpisodeAttributes[] = [
  {
    episodeId: season48EpisodeIds.episode1,
    seasonId: 48,
    episodeNumber: 1,
    episodeTitle: 'The Get to Know You Game',
    episodeAirDate: new Date('2025-02-26T19:00:00-06:00'),
    episodeDescription: '',
    episodeType: EpisodeType.PREMIERE,
  },
  {
    episodeId: season48EpisodeIds.episode2,
    seasonId: 48,
    episodeNumber: 2,
    episodeTitle: 'Humble Traits',
    episodeAirDate: new Date('2025-03-05T19:00:00-06:00'),
    episodeDescription: '',
    episodeType: EpisodeType.PREMERGE,
  },
  {
    episodeId: season48EpisodeIds.episode3,
    seasonId: 48,
    episodeNumber: 3,
    episodeTitle: 'Committing to the Bit',
    episodeAirDate: new Date('2025-03-12T19:00:00-06:00'),
    episodeDescription: '',
    episodeType: EpisodeType.PREMERGE,
  },
  {
    episodeId: season48EpisodeIds.episode4,
    seasonId: 48,
    episodeNumber: 4,
    episodeTitle: "The House Party's Over",
    episodeAirDate: new Date('2025-03-19T19:00:00-06:00'),
    episodeDescription: '',
    episodeType: EpisodeType.PREMERGE,
    isTribeSwitch: true,
  },
  {
    episodeId: season48EpisodeIds.episode5,
    seasonId: 48,
    episodeNumber: 5,
    episodeTitle: 'Master Class in Deception',
    episodeAirDate: new Date('2025-03-26T19:00:00-06:00'),
    episodeDescription: '',
    episodeType: EpisodeType.PREMERGE,
  },
  {
    episodeId: season48EpisodeIds.episode6,
    seasonId: 48,
    episodeNumber: 6,
    episodeTitle: 'Doing the Damn Thing',
    episodeAirDate: new Date('2025-04-02T19:00:00-06:00'),
    episodeDescription: '',
    episodeType: EpisodeType.PREMERGE,
  },
];

export default season48EpisodeData;
