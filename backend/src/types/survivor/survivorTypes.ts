import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';

export type SurvivorWithDetails = Omit<SurvivorsAttributes, 'SURVIVOR_ID'> & SurvivorDetailsOnSeasonAttributes;

//Result of SurvivorWithDetails including Survivors
export interface SurvivorDetailsOnSeasonIncludeSurvivors extends SurvivorDetailsOnSeasonAttributes {
  Survivor: Omit<SurvivorsAttributes, 'SURVIVOR_ID'>;
}
