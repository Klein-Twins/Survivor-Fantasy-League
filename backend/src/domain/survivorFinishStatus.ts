// --- Imports ---
import { Transaction } from 'sequelize';
import { SeasonEliminationAttributes } from '../models/season/SeasonEliminations';
import { DomainModel } from './domainModel';
import { Transactional } from './Transactional';
import { models } from '../config/db';
import { Episode } from './episode';
import { InternalServerError } from '../utils/errors/errors';
import { SurvivorsAttributes } from '../models/survivors/Survivors';
import { SeasonsAttributes } from '../models/season/Seasons';
import { SurvivorFinishStatus as SurvivorFinishStatusDTO } from '../generated-api';

// --- Type Definitions ---
export type SurvivorFinishStatusProperties =
  | SurvivorFinishStatusNotEliminated
  | SurvivorFinishStatusEliminated;

export type SurvivorFinishStatusNotEliminated = {
  isTorchSnuffed: false;
  episodeEliminated?: undefined;
  placement?: undefined;
  notes?: undefined;
  day?: undefined;
  seq?: undefined;
  juryPlacement?: undefined;
  type?: undefined;
};

export type SurvivorFinishStatusEliminated = {
  isTorchSnuffed: true;
  episodeEliminated: Episode;
  placement: SeasonEliminationAttributes['placement'];
  notes: SeasonEliminationAttributes['notes'];
  day: SeasonEliminationAttributes['day'];
  seq: SeasonEliminationAttributes['seq'];
  juryPlacement: SeasonEliminationAttributes['juryPlacement'];
  type: SeasonEliminationAttributes['type'];
};

// --- Class Definition ---
export class SurvivorFinishStatus
  implements DomainModel<SeasonEliminationAttributes, SurvivorFinishStatusDTO>
{
  // --- Core Properties ---
  private isTorchSnuffed: boolean;
  private episodeEliminated?: Episode;
  private placement?: SeasonEliminationAttributes['placement'];
  private notes?: SeasonEliminationAttributes['notes'];
  private day?: SeasonEliminationAttributes['day'];
  private seq?: SeasonEliminationAttributes['seq'];
  private juryPlacement?: SeasonEliminationAttributes['juryPlacement'];
  private type?: SeasonEliminationAttributes['type'];

  // --- Constructor ---
  constructor(
    survivorFinishStatusPropertyValues: SurvivorFinishStatusProperties
  ) {
    if (!survivorFinishStatusPropertyValues.isTorchSnuffed) {
      this.isTorchSnuffed = false;
    } else {
      this.episodeEliminated =
        survivorFinishStatusPropertyValues.episodeEliminated;
      this.placement = survivorFinishStatusPropertyValues.placement;
      this.notes = survivorFinishStatusPropertyValues.notes;
      this.day = survivorFinishStatusPropertyValues.day;
      this.seq = survivorFinishStatusPropertyValues.seq;
      this.juryPlacement = survivorFinishStatusPropertyValues.juryPlacement;
      this.type = survivorFinishStatusPropertyValues.type;
      this.isTorchSnuffed = true;
    }
  }

  // --- Static Methods ---
  /**
   * Fetch the elimination status of a survivor.
   */
  static async fetchSurvivorEliminationStatus(
    survivorId: SurvivorsAttributes['id'],
    seasonId: SeasonsAttributes['seasonId'],
    episodesInSeason: Episode[]
  ): Promise<SurvivorFinishStatus> {
    const survivorEliminationAttributes =
      await models.SeasonEliminations.findOne({
        where: {
          survivorId: survivorId,
          seasonId: seasonId,
        },
      });

    if (!survivorEliminationAttributes) {
      return new SurvivorFinishStatus({
        isTorchSnuffed: false,
      });
    }

    const episodeEliminated = episodesInSeason.find(
      (episode) =>
        episode.getAttributes().id === survivorEliminationAttributes.episodeId
    );

    if (!episodeEliminated) {
      throw new InternalServerError(
        `Cannot fetch SurvivorFinishStatus for ${survivorId} on season ${seasonId} because episode with ID ${survivorEliminationAttributes.episodeId} not found in episodesInSeason`
      );
    }

    return new SurvivorFinishStatus({
      isTorchSnuffed: true,
      episodeEliminated: episodeEliminated,
      placement: survivorEliminationAttributes.placement,
      notes: survivorEliminationAttributes.notes,
      day: survivorEliminationAttributes.day,
      seq: survivorEliminationAttributes.seq,
      juryPlacement: survivorEliminationAttributes.juryPlacement,
      type: survivorEliminationAttributes.type,
    });
  }

  /**
   * Create a SurvivorFinishStatus instance from attributes.
   */
  static fromAttributes(
    attributes: Omit<SeasonEliminationAttributes, 'episodeId'> | null,
    episode: Episode | null = null
  ): SurvivorFinishStatus {
    if (!attributes) {
      return new SurvivorFinishStatus({
        isTorchSnuffed: false,
      });
    } else {
      if (!episode) {
        throw new InternalServerError(
          `Cannot create SurvivorFinishStatus with isTorchSnuffed=true from attributes because episode is null`
        );
      }
      return new SurvivorFinishStatus({
        episodeEliminated: episode,
        placement: attributes.placement,
        notes: attributes.notes,
        day: attributes.day,
        seq: attributes.seq,
        juryPlacement: attributes.juryPlacement,
        type: attributes.type,
        isTorchSnuffed: true,
      });
    }
  }

  // --- Instance Methods ---
  /**
   * Save the SurvivorFinishStatus instance to the database.
   */
  @Transactional()
  async save(
    survivorId: SurvivorsAttributes['id'],
    seasonId: SeasonsAttributes['seasonId'],
    transaction?: Transaction
  ): Promise<void> {
    if (!this.isTorchSnuffed) {
      await models.SeasonEliminations.destroy({
        where: {
          survivorId: survivorId,
          seasonId: seasonId,
        },
        transaction: transaction,
      });
    } else {
      if (
        !this.episodeEliminated ||
        !this.placement ||
        !this.notes === undefined ||
        !this.day ||
        !this.seq ||
        this.juryPlacement === undefined ||
        !this.type
      ) {
        throw new InternalServerError(
          `Cannot save SurvivorFinishStatus with eliminated status for ${survivorId} on season ${seasonId} because not all properties are set`
        );
      }
      await models.SeasonEliminations.upsert(
        {
          seasonId: seasonId,
          survivorId: survivorId,
          notes: this.notes,
          day: this.day,
          seq: this.seq,
          episodeId: this.episodeEliminated?.getAttributes().id,
          placement: this.placement,
          juryPlacement: this.juryPlacement,
          type: this.type,
        },
        {
          transaction: transaction,
        }
      );
    }
  }

  /**
   * Set the SurvivorFinishStatus instance to eliminated.
   */
  setEliminationDetails(
    survivorFinishStatus: Omit<SurvivorFinishStatusEliminated, 'isTorchSnuffed'>
  ): void {
    this.isTorchSnuffed = true;
    this.episodeEliminated = survivorFinishStatus.episodeEliminated;
    this.placement = survivorFinishStatus.placement;
    this.notes = survivorFinishStatus.notes;
    this.day = survivorFinishStatus.day;
    this.seq = survivorFinishStatus.seq;
    this.juryPlacement = survivorFinishStatus.juryPlacement;
    this.type = survivorFinishStatus.type;
  }

  /**
   * Convert the SurvivorFinishStatus instance to a DTO.
   */
  toDTO(): SurvivorFinishStatusDTO {
    return {
      isTorchSnuffed: this.isTorchSnuffed,
      placement: this.placement,
      placementText: this.placement
        ? getNumericalText(this.placement)
        : undefined,
      dayEliminated: this.day,
      juryPlacement: this.juryPlacement,
      juryPlacementText: this.juryPlacement
        ? getNumericalText(this.juryPlacement)
        : undefined,
      episodeIdEliminated:
        this.episodeEliminated?.getAttributes().id || undefined,
      eliminationType: this.type,
    };
  }

  /**
   * Get the attributes of the SurvivorFinishStatus instance.
   */
  getAttributes(): SurvivorFinishStatusProperties {
    if (this.isTorchSnuffed) {
      // Return SurvivorFinishStatusEliminated
      return {
        isTorchSnuffed: true,
        episodeEliminated: this.episodeEliminated!,
        placement: this.placement!,
        notes: this.notes!,
        day: this.day!,
        seq: this.seq!,
        juryPlacement: this.juryPlacement!,
        type: this.type!,
      };
    } else {
      // Return SurvivorFinishStatusNotEliminated
      return {
        isTorchSnuffed: false,
      };
    }
  }
}

// --- Utility Functions ---
/**
 * Get the ordinal text for a number (e.g., 1 -> "1st", 2 -> "2nd").
 */
export function getNumericalText(number: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = number % 100;
  return (
    number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
  );
}
