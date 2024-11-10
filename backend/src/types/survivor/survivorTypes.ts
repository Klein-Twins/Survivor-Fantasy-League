import { SurvivorDetailsOnSeasonAttributes } from "../../models/SurvivorDetailsOnSeason";
import { SurvivorsAttributes } from "../../models/Survivors";

export type SurvivorWithDetails = Omit<SurvivorsAttributes, "SURVIVOR_ID"> & SurvivorDetailsOnSeasonAttributes;

//Result of SurvivorWithDetails including Survivors
export interface SurvivorDetailsOnSeasonIncludeSurvivors extends SurvivorDetailsOnSeasonAttributes {
    Survivor: Omit<SurvivorsAttributes, "SURVIVOR_ID">
}