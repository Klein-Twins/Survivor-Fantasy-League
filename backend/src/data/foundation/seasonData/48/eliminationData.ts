import { SeasonEliminationAttributes } from '../../../../models/season/SeasonEliminations';
import { season48EpisodeIds, season48SurvivorIds } from '../../foundationIds';

const season48EliminationData: SeasonEliminationAttributes[] = [
  {
    seasonId: 48,
    episodeId: season48EpisodeIds.episode1,
    survivorId: season48SurvivorIds.StephanieBerger,
    day: 3,
    notes: '',
    seq: 1,
  },
  {
    seasonId: 48,
    episodeId: season48EpisodeIds.episode2,
    survivorId: season48SurvivorIds.KevinLeung,
    day: 5,
    notes: '',
    seq: 1,
  },
  {
    seasonId: 48,
    episodeId: season48EpisodeIds.episode3,
    day: 7,
    survivorId: season48SurvivorIds.JustinPioppi,
    notes: '',
    seq: 1,
  },
];

export default season48EliminationData;
