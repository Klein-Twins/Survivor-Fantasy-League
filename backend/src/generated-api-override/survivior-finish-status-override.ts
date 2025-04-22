import { SurvivorFinishStatus } from '../domain/season/survivor/survivorFinishStatus';
import { SurvivorEliminationType } from '../generated-api/models';

export interface SurvivorFinishStatusNotEliminated
  extends SurvivorFinishStatus {}

export interface SurvivorFinishStatusEliminated extends SurvivorFinishStatus {
  isTorchSnuffed: true;
  placement: number | null;
  placementText: string | null;
  dayEliminated: number | null;
  juryPlacement: number | null;
  juryPlacementText: string | null;
  episodeIdEliminated: string | null;
  eliminationType: SurvivorEliminationType;
}
