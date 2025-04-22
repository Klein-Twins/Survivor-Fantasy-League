import { EpisodeAttributes } from '../../../models/season/Episodes';
import { SeasonEliminationAttributes } from '../../../models/season/SeasonEliminations';
import { SurvivorEliminationDetails } from '../../../services/season/episode/events/survivorEliminationEventService';
import { ConflictError } from '../../../utils/errors/errors';
import { SurvivorFinishStatus as SurvivorEliminationStatusDTO } from '../../../generated-api';

type SurvivorEliminationStatusType =
  | {
      isTorchSnuffed: true;
      eliminationDetails: SurvivorEliminationStatusTypeDetails;
    }
  | {
      isTorchSnuffed: false;
      eliminationDetails: null;
    };

export type SurvivorEliminationStatusTypeDetails = {
  seq: SeasonEliminationAttributes['seq'];
  notes: SeasonEliminationAttributes['notes'] | null;
  placement: SeasonEliminationAttributes['placement'];
  dayEliminated: SeasonEliminationAttributes['day'];
  juryPlacement: SeasonEliminationAttributes['juryPlacement'];
  episodeIdEliminated: EpisodeAttributes['id'];
  eliminationType: SeasonEliminationAttributes['type'];
};

export class SurvivorEliminationStatus {
  private isTorchSnuffed: boolean;
  private day: SeasonEliminationAttributes['day'] | null;
  private notes: SeasonEliminationAttributes['notes'] | null;
  private seq: SeasonEliminationAttributes['seq'] | null;
  private placement: SeasonEliminationAttributes['placement'] | null;
  private juryPlacement: SeasonEliminationAttributes['juryPlacement'] | null;
  private type: SeasonEliminationAttributes['type'] | null;
  private episodeIdEliminated: EpisodeAttributes['id'] | null;

  constructor(survivorEliminationStatus: SurvivorEliminationStatusType) {
    if (survivorEliminationStatus.isTorchSnuffed) {
      this.isTorchSnuffed = true;
      this.placement = survivorEliminationStatus.eliminationDetails.placement;
      this.day = survivorEliminationStatus.eliminationDetails.dayEliminated;
      this.seq = survivorEliminationStatus.eliminationDetails.seq;
      this.juryPlacement =
        survivorEliminationStatus.eliminationDetails.juryPlacement;
      this.notes = survivorEliminationStatus.eliminationDetails.notes;
      this.type = survivorEliminationStatus.eliminationDetails.eliminationType;
      this.episodeIdEliminated =
        survivorEliminationStatus.eliminationDetails.episodeIdEliminated;
    } else {
      this.isTorchSnuffed = false;
      this.placement = null;
      this.day = null;
      this.seq = null;
      this.juryPlacement = null;
      this.type = null;
      this.notes = null;
      this.episodeIdEliminated = null;
    }
  }

  getIsTorchSnuffed(): boolean {
    return this.isTorchSnuffed;
  }

  getPlacement(): SeasonEliminationAttributes['placement'] | null {
    return this.placement;
  }
  getDay(): SeasonEliminationAttributes['day'] | null {
    return this.day;
  }
  getSeq(): SeasonEliminationAttributes['seq'] | null {
    return this.seq;
  }
  getJuryPlacement(): SeasonEliminationAttributes['juryPlacement'] | null {
    return this.juryPlacement;
  }
  getType(): SeasonEliminationAttributes['type'] | null {
    return this.type;
  }
  getEpisodeIdEliminated(): EpisodeAttributes['id'] | null {
    return this.episodeIdEliminated;
  }
  getNotes(): SeasonEliminationAttributes['notes'] | null {
    return this.notes;
  }

  setElimination(
    eliminationDetails: SurvivorEliminationStatusTypeDetails & {
      episodeIdEliminated: EpisodeAttributes['id'];
    }
  ) {
    if (this.isTorchSnuffed) {
      throw new ConflictError('Survivor is already eliminated');
    }
    this.isTorchSnuffed = true;
    this.placement = eliminationDetails.placement;
    this.day = eliminationDetails.dayEliminated;
    this.seq = eliminationDetails.seq;
    this.juryPlacement = eliminationDetails.juryPlacement;
    this.notes = eliminationDetails.notes;
    this.type = eliminationDetails.eliminationType;
    this.episodeIdEliminated = eliminationDetails.episodeIdEliminated;
  }

  toDTO(): SurvivorEliminationStatusDTO {
    return {
      isTorchSnuffed: this.isTorchSnuffed,
      placement: this.placement,
      placementText: this.placement ? getNumericalText(this.placement) : null,
      dayEliminated: this.day,
      juryPlacement: this.juryPlacement,
      juryPlacementText: this.juryPlacement
        ? getNumericalText(this.juryPlacement)
        : null,
      episodeIdEliminated: this.episodeIdEliminated,
      eliminationType: this.type ?? undefined,
    };
  }
}

function getNumericalText(number: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = number % 100;
  return (
    number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
  );
}
