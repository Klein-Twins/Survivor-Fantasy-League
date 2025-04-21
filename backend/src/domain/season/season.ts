import { models } from '../../config/db';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SeasonSurvivor } from './survivor/seasonSurvivor';
import { Season as SeasonDTO } from '../../generated-api/models/season';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import { DomainModel } from '../domainModel';
import { TribeAttributes } from '../../models/season/Tribes';
import { ConflictError } from '../../utils/errors/errors';
import { Transaction } from 'sequelize';
import { Transactional } from '../../repositoriesBackup/utils/Transactional';
import { Tribe } from './tribe/tribe';
import { Episode } from './episode/episode';

type SeasonProperties = {
  id: SeasonsAttributes['seasonId'];
  name: SeasonsAttributes['name'];
  startDate: SeasonsAttributes['startDate'];
  endDate: SeasonsAttributes['endDate'];
  location: SeasonsAttributes['location'];
  theme: SeasonsAttributes['theme'];
  isActive: SeasonsAttributes['isActive'];
  survivors: SeasonSurvivor[];
  tribesInSeason: Tribe[];
  episodes: Episode[];
};
export class Season implements DomainModel<SeasonsAttributes, SeasonDTO> {
  // --- Core Properties ---
  private id: number;
  private name: string;
  private startDate: Date | null;
  private endDate: Date | null;
  private location: string;
  private theme: string;
  private isActive: boolean;
  private survivors: SeasonSurvivor[];
  private tribesInSeason: Tribe[];
  private episodes: Episode[];

  // --- Constructor ---
  constructor(seasonPropertyValues: SeasonProperties) {
    this.id = seasonPropertyValues.id;
    this.name = seasonPropertyValues.name;
    this.startDate = seasonPropertyValues.startDate;
    this.endDate = seasonPropertyValues.endDate;
    this.location = seasonPropertyValues.location;
    this.theme = seasonPropertyValues.theme;
    this.isActive = seasonPropertyValues.isActive;
    this.survivors = seasonPropertyValues.survivors;
    this.tribesInSeason = seasonPropertyValues.tribesInSeason;
    this.episodes = seasonPropertyValues.episodes;
  }

  // --- Static Methods: Retrieval ---
  /**
   * Retrieve a Season by ID from the database.
   */
  static async findById(
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<Season> {
    const seasonData = await models.Seasons.findByPk(seasonId);
    if (!seasonData) {
      throw new Error(`Season with ID ${seasonId} not found`);
    }
    const episodes = await Season.fetchEpisodes(seasonId);
    const survivors = await Season.fetchSurvivors(seasonId, episodes);
    const tribes = await Season.fetchTribes(seasonId, survivors, episodes);

    for (const episode of episodes) {
      await episode.fetchTribesStateOnEpisode(tribes, survivors);
    }

    return Season.fromAttributes(seasonData, survivors, tribes, episodes);
  }

  /**
   * Fetch survivors associated with this season.
   */
  private static async fetchSurvivors(
    seasonId: SeasonsAttributes['seasonId'],
    episodesInSeason: Episode[]
  ): Promise<SeasonSurvivor[]> {
    return await SeasonSurvivor.fetchSeasonSurvivorsBySeasonId(
      seasonId,
      episodesInSeason
    );
  }

  /**
   * Fetch tribes associated with this season.
   */
  private static async fetchTribes(
    seasonId: SeasonsAttributes['seasonId'],
    survivors: SeasonSurvivor[],
    episodesInSeason: Episode[] = []
  ): Promise<Tribe[]> {
    const tribesData = await models.Tribe.findAll({ where: { seasonId } });
    const tribesInSeason = [];
    for (const tribeData of tribesData) {
      const tribe = await Tribe.fetchTribeById(
        tribeData.id,
        survivors,
        episodesInSeason
      );
      tribesInSeason.push(tribe);
    }
    return tribesInSeason;
  }

  /**
   * Fetch episodes associated with this season.
   */
  private static async fetchEpisodes(
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<Episode[]> {
    const episodesData = await models.Episode.findAll({ where: { seasonId } });
    const episodes: Episode[] = [];
    for (const episodeData of episodesData) {
      const episode = await Episode.findById(episodeData.id);
      episodes.push(episode);
    }
    return episodes;
  }

  /**
   * Create a new Season instance from attributes.
   */
  static fromAttributes(
    seasonAttributes: SeasonsAttributes,
    survivors: SeasonSurvivor[] = [],
    tribes: Tribe[] = [],
    episodes: Episode[] = []
  ): Season {
    return new Season({
      id: seasonAttributes.seasonId,
      name: seasonAttributes.name,
      startDate: seasonAttributes.startDate,
      endDate: seasonAttributes.endDate,
      location: seasonAttributes.location,
      theme: seasonAttributes.theme,
      isActive: seasonAttributes.isActive,
      survivors,
      tribesInSeason: tribes,
      episodes,
    });
  }

  // --- Instance Methods: CRUD Operations ---
  /**
   * Save the Season instance to the database.
   */

  @Transactional()
  async save(transaction?: Transaction): Promise<void> {
    const startDateObject = this.startDate ? new Date(this.startDate) : null;
    const endDateObject = this.endDate ? new Date(this.endDate) : null;

    await models.Seasons.upsert({
      seasonId: this.id,
      name: this.name,
      startDate: startDateObject,
      endDate: endDateObject,
      location: this.location,
      theme: this.theme,
      isActive: this.isActive,
    });

    for (const episode of this.episodes) {
      await episode.save(transaction);
    }

    for (const survivor of this.survivors) {
      await survivor.save(transaction);
    }

    for (const tribe of this.tribesInSeason) {
      await tribe.save(transaction);
    }
  }

  /**
   * Add a survivor to the season.
   */
  addSurvivor(survivor: SeasonSurvivor): void {
    const survivorAttributes = survivor.getAttributes();

    const isSurvivorOnSeason = this.survivors.some(
      (s) => s === survivor || s.getAttributes().id === survivorAttributes.id
    );
    if (isSurvivorOnSeason) {
      throw new ConflictError(
        `Survivor with ID ${survivorAttributes.id} is already added to this season`
      );
    }
    this.survivors.push(survivor);
  }

  /**
   * Add a tribe to the season.
   */
  addTribe(tribe: Tribe): void {
    this.tribesInSeason.push(tribe);
  }

  /**
   * Add an episode to the season.
   */
  addEpisode(episode: Episode): void {
    this.episodes.push(episode);
  }

  // --- Instance Methods: Getters ---
  /**
   * Get a survivor by ID.
   */
  getSurvivorById(id: SurvivorsAttributes['id']): SeasonSurvivor {
    const survivor = this.survivors.find((s) => s.getAttributes().id === id);
    if (!survivor) {
      throw new Error(`Survivor with ID ${id} not found in this season`);
    }
    return survivor;
  }

  getSurvivors(): SeasonSurvivor[] {
    return this.survivors;
  }

  /**
   * Get a tribe by ID.
   */
  getTribeById(id: TribeAttributes['id']): Tribe {
    const tribe = this.tribesInSeason.find((t) => t.getAttributes().id === id);
    if (!tribe) {
      throw new Error(`Tribe with ID ${id} not found in this season`);
    }
    return tribe;
  }

  getTribes(): Tribe[] {
    return this.tribesInSeason;
  }

  /**
   * Get an episode by ID.
   */
  getEpisodeById(id: Episode['id']): Episode {
    const episode = this.episodes.find((e) => e.getAttributes().id === id);
    if (!episode) {
      throw new Error(`Episode with ID ${id} not found in this season`);
    }
    return episode;
  }

  /**
   * Get an episode by number.
   */
  getEpisodeByNumber(number: Episode['number']): Episode | undefined {
    const episode = this.episodes.find(
      (e) => e.getAttributes().number === number
    );
    if (!episode) {
      throw new Error(`Episode with number ${number} not found in this season`);
    }
    return episode;
  }

  getEpisodes(): Episode[] {
    return this.episodes;
  }

  // --- Instance Methods: Conversion ---

  /**
   * Get the attributes of the Survivor instance.
   */
  getAttributes(): SeasonsAttributes {
    return {
      seasonId: this.id,
      name: this.name,
      startDate: this.startDate,
      endDate: this.endDate,
      location: this.location,
      theme: this.theme,
      isActive: this.isActive,
    };
  }

  /**
   * Convert the Season instance to SeasonDTO for API use.
   */
  toDTO(): SeasonDTO {
    const survivorsDTO = this.survivors.map((survivor) => survivor.toDTO());
    const tribesDTO = this.tribesInSeason.map((tribe) => tribe.toDTO());
    const episodesDTO = this.episodes.map((episode) => episode.toDTO());

    return {
      id: this.id,
      name: this.name,
      startDate: this.startDate?.toISOString() || null,
      endDate: this.endDate?.toISOString() || null,
      location: this.location,
      theme: this.theme,
      isActive: this.isActive,
      survivors: survivorsDTO,
      episodes: episodesDTO,
      nextEpisode: null,
      tribesInSeason: tribesDTO,
    };
  }
}
