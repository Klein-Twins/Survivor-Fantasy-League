// --- Imports ---
import { Survivor as SurvivorDTO } from '../generated-api/models/survivor';
import { SurvivorsAttributes } from '../models/survivors/Survivors';
import { SurvivorDetailsOnSeasonAttributes } from '../models/survivors/SurvivorDetailsOnSeason';
import { models } from '../config/db';
import { SeasonsAttributes } from '../models/season/Seasons';
import { DomainModel } from './domainModel';
import { ConflictError, NotFoundError } from '../utils/errors/errors';
import { Survivor, SurvivorProperties } from './survivor';
import { Transactional } from './Transactional';
import { Transaction } from 'sequelize';
import {
  SurvivorFinishStatus,
  SurvivorFinishStatusEliminated,
} from './survivorFinishStatus';
import { Episode } from './episode';

// --- Type Definitions ---
export type SeasonSurvivorProperties = SurvivorProperties & {
  seasonId: SeasonsAttributes['seasonId'];
  age: SurvivorDetailsOnSeasonAttributes['age'];
  description: SurvivorDetailsOnSeasonAttributes['description'];
  job: SurvivorDetailsOnSeasonAttributes['job'];
  survivorFinishStatus: SurvivorFinishStatus;
};

// --- Class Definition ---
export class SeasonSurvivor
  extends Survivor
  implements DomainModel<SurvivorDetailsOnSeasonAttributes, SurvivorDTO>
{
  // --- Core Properties ---
  private seasonId: SeasonsAttributes['seasonId'];
  private age: SurvivorDetailsOnSeasonAttributes['age'];
  private description: SurvivorDetailsOnSeasonAttributes['description'];
  private job: SurvivorDetailsOnSeasonAttributes['job'];
  private survivorFinishStatus: SurvivorFinishStatus;

  // --- Constructor ---
  constructor(survivorPropertyValues: SeasonSurvivorProperties) {
    super(survivorPropertyValues);
    this.seasonId = survivorPropertyValues.seasonId;
    this.age = survivorPropertyValues.age;
    this.description = survivorPropertyValues.description;
    this.job = survivorPropertyValues.job;
    this.survivorFinishStatus = survivorPropertyValues.survivorFinishStatus;
  }

  // --- Static Methods ---
  /**
   * Fetch a SeasonSurvivor by season ID and survivor ID.
   */
  private static async fetchSeasonSurvivorBySeasonIdAndSurvivorId(
    seasonId: SeasonsAttributes['seasonId'],
    survivorId: SurvivorsAttributes['id'],
    episodesInSeason: Episode[] = []
  ): Promise<SeasonSurvivor> {
    const survivor = await Survivor.fetchSurvivorById(survivorId);

    const seasonSurvivorData = await models.SurvivorDetailsOnSeason.findOne({
      where: {
        seasonId: seasonId,
        id: survivorId,
      },
    });

    if (!seasonSurvivorData) {
      throw new NotFoundError(
        `Survivor with ID ${survivorId} not found on season ${seasonId}`
      );
    }

    const survivorDetailsOnSeasonAttributes: SurvivorDetailsOnSeasonAttributes =
      seasonSurvivorData.get({ plain: true });
    const survivorAttributes: SurvivorsAttributes = survivor.getAttributes();

    const survivorFinishStatus =
      await SurvivorFinishStatus.fetchSurvivorEliminationStatus(
        survivorId,
        seasonId,
        episodesInSeason
      );

    return SeasonSurvivor.fromAttributes(
      {
        ...survivorDetailsOnSeasonAttributes,
        ...survivorAttributes,
      },
      survivorFinishStatus
    );
  }

  /**
   * Fetch all SeasonSurvivors for a given season ID.
   */
  static async fetchSeasonSurvivorsBySeasonId(
    seasonId: SeasonsAttributes['seasonId'],
    episodesInSeason: Episode[] = []
  ): Promise<SeasonSurvivor[]> {
    const seasonSurvivorsData = await models.SurvivorDetailsOnSeason.findAll({
      where: {
        seasonId: seasonId,
      },
    });

    const seasonSurvivors: SeasonSurvivor[] = [];
    for (const seasonSurvivorData of seasonSurvivorsData) {
      const seasonSurvivor =
        await SeasonSurvivor.fetchSeasonSurvivorBySeasonIdAndSurvivorId(
          seasonId,
          seasonSurvivorData.id,
          episodesInSeason
        );
      seasonSurvivors.push(seasonSurvivor);
    }
    return seasonSurvivors;
  }

  /**
   * Create a SeasonSurvivor instance from attributes.
   */
  static fromAttributes(
    attributes: SurvivorDetailsOnSeasonAttributes & SurvivorsAttributes,
    survivorFinishStatus: SurvivorFinishStatus = new SurvivorFinishStatus({
      isTorchSnuffed: false,
    })
  ): SeasonSurvivor {
    return new SeasonSurvivor({
      id: attributes.id,
      name: `${attributes.firstName} ${attributes.lastName}`,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      nickName: attributes.nickName,
      fromCity: attributes.fromCity,
      fromState: attributes.fromState,
      fromCountry: attributes.fromCountry,
      seasonId: attributes.seasonId,
      age: attributes.age,
      description: attributes.description,
      job: attributes.job,
      survivorFinishStatus: survivorFinishStatus,
    });
  }

  // --- Instance Methods ---
  /**
   * Save the SeasonSurvivor instance to the database.
   */
  @Transactional()
  async save(transaction?: Transaction): Promise<void> {
    await super.save(transaction);
    await models.SurvivorDetailsOnSeason.upsert(
      {
        id: this.id,
        seasonId: this.seasonId,
        age: this.age,
        description: this.description,
        job: this.job,
      },
      { transaction }
    );
    await this.survivorFinishStatus.save(this.id, this.seasonId, transaction);
  }

  /**
   * Eliminate the survivor on the season
   */
  eliminate(
    eliminationDetails: Omit<SurvivorFinishStatusEliminated, 'isTorchSnuffed'>
  ): void {
    if (this.survivorFinishStatus.getAttributes().isTorchSnuffed) {
      throw new ConflictError(`Survivor ${this.name} is already eliminated`);
    }
    this.survivorFinishStatus.setEliminationDetails(eliminationDetails);
  }

  /**
   * Convert the SeasonSurvivor instance to a DTO.
   */
  toDTO(params: void): SurvivorDTO {
    return {
      id: this.id,
      name: this.name,
      firstName: this.firstName,
      lastName: this.lastName,
      fromCity: this.fromCity,
      fromState: this.fromState,
      fromCountry: this.fromCountry,
      nickName: this.nickName,
      seasonId: this.seasonId,
      age: this.age,
      description: this.description,
      job: this.job,
      finishStatus: {},
    };
  }

  /**
   * Get the attributes of the SeasonSurvivor instance.
   */
  getAttributes(): SurvivorDetailsOnSeasonAttributes & SurvivorsAttributes {
    const survivorAttributes = super.getAttributes();
    return {
      ...survivorAttributes,
      seasonId: this.seasonId,
      age: this.age,
      description: this.description,
      job: this.job,
    };
  }
}
