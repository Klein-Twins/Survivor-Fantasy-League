import { SurvivorDetailsOnSeasonAttributes } from "../../models/SurvivorDetailsOnSeason";
import { SurvivorsAttributes } from "../../models/Survivors";

export type SurvivorWithDetails = Omit<SurvivorsAttributes, "SURVIVOR_ID"> & SurvivorDetailsOnSeasonAttributes;