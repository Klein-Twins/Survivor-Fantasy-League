import { EpisodeAttributes } from '../../../models/season/Episodes';
import { SeasonEliminationAttributes } from '../../../models/season/SeasonEliminations';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { TribeAttributes } from '../../../models/season/Tribes';
import { SurvivorsAttributes } from '../../../models/survivors/Survivors';

export type EpisodeEvents = {
  tribeStartEvent?: TribeStartEvent;
};

export type TribalCouncilEvent = {
  eliminatedSurvivor: SurvivorsAttributes['id'];
  episodeId: EpisodeAttributes['id'];
  seasonId: SeasonsAttributes['seasonId'];
  day: SeasonEliminationAttributes['day'];
  seq: SeasonEliminationAttributes['seq']; //seq of the tribal council on that episode
};

export type TribeStartEvent = TribeStart[];

export type TribeStart = Omit<
  TribeAttributes,
  'seasonId' | 'episodeIdStart' | 'episodeIdEnd' | 'mergeTribe'
> & {
  startingSurvivors: SurvivorsAttributes['id'][];
};

export class EpisodeEventService {}
