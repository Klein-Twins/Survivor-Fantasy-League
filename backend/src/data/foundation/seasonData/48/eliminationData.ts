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
    placement: 18,
  },
  {
    seasonId: 48,
    episodeId: season48EpisodeIds.episode2,
    survivorId: season48SurvivorIds.KevinLeung,
    day: 5,
    notes: '',
    seq: 1,
    placement: 17,
  },
  {
    seasonId: 48,
    episodeId: season48EpisodeIds.episode3,
    day: 7,
    survivorId: season48SurvivorIds.JustinPioppi,
    notes: '',
    seq: 1,
    placement: 16,
  },
  {
    seasonId: 48,
    episodeId: season48EpisodeIds.episode4,
    day: 9,
    survivorId: season48SurvivorIds.ThomasKrottinger,
    notes: '',
    seq: 1,
    placement: 15,
  },
  {
    seasonId: 48,
    episodeId: season48EpisodeIds.episode5,
    day: 11,
    survivorId: season48SurvivorIds.BiancaRoses,
    notes: '',
    seq: 1,
    placement: 14,
  },
];

export default season48EliminationData;
