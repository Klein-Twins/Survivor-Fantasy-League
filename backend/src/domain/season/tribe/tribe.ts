// --- Imports ---
import { TribeAttributes } from '../../../models/season/Tribes';
import { DomainModel } from '../../domainModel';
import { Tribe as TribeDTO } from '../../../generated-api/models/tribe';
import { Color } from '../../../generated-api/models/color';
import { models } from '../../../config/db';
import { UUID } from 'crypto';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { ConflictError } from '../../../utils/errors/errors';
import logger from '../../../config/logger';
import { Transactional } from '../../../repositories/utils/Transactional';
import { Transaction } from 'sequelize';
import { SeasonSurvivor } from '../survivor/seasonSurvivor';
import { SurvivorBasic } from '../../../generated-api';
import { Episode } from '../episode/episode';
import { Survivor } from '../../survivor/survivor';

// --- Type Definitions ---
// export type TribeProperties = {
//   seasonId: SeasonsAttributes['seasonId'];
//   id: TribeAttributes['id'];
//   name: TribeAttributes['name'];
//   color: Color;
//   isMergeTribe: TribeAttributes['mergeTribe'];
//   episodeStart: Episode | null;
//   episodeEnded: Episode | null;
//   startingSurvivors: Survivor[];
// };

export type TribeProperties = Omit<
  TribeAttributes,
  'episodeIdStart' | 'episodeIdEnd' | 'color' | 'hexColor'
> & {
  episodeStart: Episode | null;
  episodeEnded: Episode | null;
  color: Color;
  startingSurvivors: Survivor[];
};

// --- Class Definition ---
export class Tribe implements DomainModel<TribeAttributes, TribeDTO> {
  // --- Core Properties ---
  private seasonId: SeasonsAttributes['seasonId'];
  private id: TribeAttributes['id'];
  private name: TribeAttributes['name'];
  private color: Color;
  private mergeTribe: TribeAttributes['mergeTribe'];
  private episodeStart: Episode | null;
  private episodeEnded: Episode | null;
  private startingSurvivors: Survivor[];

  // --- Constructor ---
  constructor(tribePropertyValue: TribeProperties) {
    this.id = tribePropertyValue.id;
    this.name = tribePropertyValue.name;
    this.color = tribePropertyValue.color;
    this.mergeTribe = tribePropertyValue.mergeTribe;
    this.episodeStart = tribePropertyValue.episodeStart;
    this.episodeEnded = tribePropertyValue.episodeEnded;
    this.startingSurvivors = tribePropertyValue.startingSurvivors;
    this.seasonId = tribePropertyValue.seasonId;
  }

  // --- Static Methods ---
  /**
   * Fetch a Tribe by ID.
   */
  static async fetchTribeById(
    tribeId: TribeAttributes['id'],
    survivorsInSeason: SeasonSurvivor[],
    episodesInSeason: Episode[]
  ): Promise<Tribe> {
    const tribeData = await models.Tribe.findByPk(tribeId);
    if (!tribeData) {
      throw new Error(`Tribe with ID ${tribeId} not found`);
    }

    const episodeStarted =
      episodesInSeason.find(
        (episode) => episode.getAttributes().id === tribeData.episodeIdStart
      ) || null;

    const survivorsInTribe = await Tribe.fetchStartingTribeMembers(
      tribeData,
      survivorsInSeason
    );

    return Tribe.fromAttributes(tribeData, survivorsInTribe, episodeStarted);
  }

  /**
   * Fetch starting tribe members. Does not create new isntances of SeasonSurvivor
   */
  static async fetchStartingTribeMembers(
    tribeAttributes: TribeAttributes,
    survivorsInSeason: SeasonSurvivor[]
  ): Promise<SeasonSurvivor[]> {
    if (!tribeAttributes.episodeIdStart) {
      logger.warn(
        `Could not fetch starting tribe members for ${tribeAttributes.name}, episode started is null`
      );
      return [];
    }
    const tribeMembersData = await models.TribeMembers.findAll({
      where: {
        tribeId: tribeAttributes.id,
        episodeIdStart: tribeAttributes.episodeIdStart,
      },
    });

    const tribeMembersIds = tribeMembersData.map(
      (tribeMemberData) => tribeMemberData.survivorId
    );

    const tribeMembers = survivorsInSeason.filter((survivor) =>
      tribeMembersIds.includes(survivor.getAttributes().id)
    );

    return tribeMembers.sort((a, b) =>
      a.getAttributes().firstName.localeCompare(b.getAttributes().firstName)
    );
  }

  /**
   * Fetch all tribes for a season.
   */
  static async fetchTribesBySeasonId(
    seasonId: SeasonsAttributes['seasonId'],
    survivorsInSeason: SeasonSurvivor[],
    episodesInSeason: Episode[]
  ): Promise<Tribe[]> {
    const tribesData = await models.Tribe.findAll({
      where: { seasonId },
    });

    const tribes: Tribe[] = [];
    for (const tribeData of tribesData) {
      const tribe = await Tribe.fetchTribeById(
        tribeData.id,
        survivorsInSeason,
        episodesInSeason
      );
      tribes.push(tribe);
    }
    return tribes;
  }

  /**
   * Create a Tribe instance from attributes.
   */
  static fromAttributes(
    attributes: Omit<TribeAttributes, 'episodeIdStart' | 'episodeIdEnd'>,
    survivorsInTribe: SeasonSurvivor[] = [],
    episodeStarted: Episode | null = null,
    episodeEnded: Episode | null = null
  ): Tribe {
    const tribePropertyValues: TribeProperties = {
      seasonId: attributes.seasonId,
      id: attributes.id,
      name: attributes.name,
      color: {
        name: attributes.color,
        hex: attributes.hexColor,
      },
      mergeTribe: attributes.mergeTribe,
      episodeStart: episodeStarted,
      episodeEnded: episodeEnded,
      startingSurvivors: survivorsInTribe,
    };

    return new Tribe(tribePropertyValues);
  }

  // --- Instance Methods ---
  /**
   * Add a starting survivor to the tribe.
   */
  addStartingSurvivor(survivor: Survivor): void {
    if (
      this.startingSurvivors.some(
        (s) =>
          s === survivor || s.getAttributes().id === survivor.getAttributes().id
      )
    ) {
      throw new ConflictError(
        `Survivor ${survivor.getAttributes.name} is already in the starting survivors list for tribe ${this.name}`
      );
    }
    this.startingSurvivors.push(survivor);
    // Sort the startingSurvivors array by first name
    this.startingSurvivors.sort((a, b) =>
      a.getAttributes().firstName.localeCompare(b.getAttributes().firstName)
    );
  }

  /**
   * Add multiple starting survivors to the tribe.
   */
  addStartingSurvivors(survivors: Survivor[]): void {
    for (const survivor of survivors) {
      this.addStartingSurvivor(survivor);
    }
  }

  /**
   * Set the start episode for the tribe.
   */
  start(episode: Episode): void {
    if (this.episodeStart) {
      throw new ConflictError(
        `Tribe ${this.name} already has a start episode set to ${
          this.episodeStart.getAttributes().number
        }`
      );
    }
    this.episodeStart = episode;
  }

  /**
   * Set the end episode for the tribe.
   */
  end(episode: Episode): void {
    this.episodeEnded = episode;
  }

  /**
   * Save the Tribe instance to the database.
   */
  @Transactional()
  async save(transaction?: Transaction): Promise<void> {
    await models.Tribe.upsert(
      {
        id: this.id as UUID,
        seasonId: this.seasonId,
        name: this.name,
        color: this.color.name,
        hexColor: this.color.hex,
        mergeTribe: this.mergeTribe,
        episodeIdStart: this.episodeStart?.getAttributes().id || null,
        episodeIdEnd: this.episodeEnded?.getAttributes().id || null,
      },
      { transaction }
    );

    if (!this.episodeStart) {
      logger.warn(
        'Could not save starting tribe members, episode started is null'
      );
      return;
    }

    for (const survivor of this.startingSurvivors) {
      await models.TribeMembers.upsert(
        {
          tribeId: this.id,
          survivorId: survivor.getAttributes().id,
          episodeIdStart: this.episodeStart.getAttributes().id,
          episodeIdEnd: null,
        },
        { transaction }
      );
    }
  }

  /**
   * Get the attributes of the Tribe instance.
   */
  getAttributes(): TribeAttributes {
    return {
      id: this.id,
      seasonId: this.seasonId,
      name: this.name,
      color: this.color.name,
      hexColor: this.color.hex,
      mergeTribe: this.mergeTribe,
      episodeIdStart: this.episodeStart?.getAttributes().id || null,
      episodeIdEnd: this.episodeEnded?.getAttributes().id || null,
    };
  }

  /**
   * Get the starting survivors of the tribe.
   */
  getStartingSurvivors(): Survivor[] {
    return this.startingSurvivors;
  }

  /**
   * Convert the Tribe instance to TribeDTO for API use.
   */
  toDTO(): TribeDTO {
    const startingSurvivorsDTO: SurvivorBasic[] = this.startingSurvivors.map(
      (survivor) => survivor.toDTOBasic()
    );
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      isMergeTribe: this.mergeTribe,
      episodeStarted: this.episodeStart?.getAttributes().id || null,
      startingSurvivors: startingSurvivorsDTO,
    };
  }
}
