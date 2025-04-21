// --- Imports ---
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { DomainModel } from '../../domainModel';
import { Episode as EpisodeDTO } from '../../../generated-api/models/episode';
import { models } from '../../../config/db';
import { Transactional } from '../../../repositories/utils/Transactional';
import { Transaction } from 'sequelize';

// --- Type Definitions ---
export type EpisodeProperties = EpisodeAttributes & {
  hasAired: boolean;
  // isTribeSwitch: EpisodeAttributes['isTribeSwitch'];
  // tribesState: Map<TribeAttributes['id'], TribeMembersState>;
};

// --- Class Definition ---
export class Episode implements DomainModel<EpisodeAttributes, EpisodeDTO> {
  // --- Core Properties ---
  private id: EpisodeAttributes['id'];
  private seasonId: EpisodeAttributes['seasonId'];
  private number: EpisodeAttributes['number'];
  private airDate: EpisodeAttributes['airDate'];
  private title: EpisodeAttributes['title'];
  private description: EpisodeAttributes['description'];
  private type: EpisodeAttributes['type'];
  private hasAired: boolean;
  //private isTribeSwitch: EpisodeAttributes['isTribeSwitch'];
  //private tribesState: Map<TribeAttributes['id'], TribeMembersState>;

  // --- Constructor ---
  constructor(episodePropertyValues: EpisodeProperties) {
    this.id = episodePropertyValues.id;
    this.seasonId = episodePropertyValues.seasonId;
    this.number = episodePropertyValues.number;
    this.airDate = episodePropertyValues.airDate;
    this.title = episodePropertyValues.title;
    this.description = episodePropertyValues.description;
    this.type = episodePropertyValues.type;
    this.hasAired = new Date() > new Date(episodePropertyValues.airDate);
    //this.isTribeSwitch = episodePropertyValues.isTribeSwitch;
    //this.tribesState = episodePropertyValues.tribesState;
  }

  // --- Static Methods ---
  /**
   * Find an episode by its ID.
   */
  static async findById(id: EpisodeAttributes['id']): Promise<Episode> {
    const episodeData = await models.Episode.findByPk(id);
    if (!episodeData) {
      throw new Error(`Episode with ID ${id} not found`);
    }
    return Episode.fromAttributes(episodeData);
  }

  /**
   * Find an episode by its season ID and episode number.
   */
  static async findBySeasonIdAndEpisodeNumber(
    seasonId: EpisodeAttributes['seasonId'],
    episodeNumber: EpisodeAttributes['number']
  ): Promise<Episode> {
    const episodeData = await models.Episode.findOne({
      where: {
        seasonId,
        number: episodeNumber,
      },
    });
    if (!episodeData) {
      throw new Error(
        `Episode with season ID ${seasonId} and episode number ${episodeNumber} not found`
      );
    }
    return Episode.findById(episodeData.id);
  }

  /**
   * Find all episodes by season ID.
   */
  static async findAllEpisodesBySeasonId(
    seasonId: EpisodeAttributes['seasonId']
  ): Promise<Episode[]> {
    const episodesData = await models.Episode.findAll({
      where: {
        seasonId,
      },
    });

    const episodes: Episode[] = [];
    for (const episodeData of episodesData) {
      const episode = await Episode.findById(episodeData.id);
      episodes.push(episode);
    }
    return episodes;
  }

  /**
   * Create an Episode instance from attributes.
   */
  static fromAttributes(episodeAttributes: EpisodeAttributes): Episode {
    return new Episode({
      id: episodeAttributes.id,
      seasonId: episodeAttributes.seasonId,
      number: episodeAttributes.number,
      airDate: episodeAttributes.airDate,
      title: episodeAttributes.title,
      description: episodeAttributes.description,
      hasAired: new Date() > episodeAttributes.airDate,
      type: episodeAttributes.type,
      //isTribeSwitch: episodeAttributes.isTribeSwitch ?? false,
      //tribesState: tribeToTribeMembershipOnEpisode,
    });
  }

  // --- Instance Methods ---
  /**
   * Save the Episode instance to the database.
   */
  @Transactional()
  async save(transaction?: Transaction): Promise<void> {
    await models.Episode.upsert(
      {
        id: this.id,
        seasonId: this.seasonId,
        number: this.number,
        airDate: this.airDate,
        title: this.title,
        description: this.description,
        type: this.type,
        //isTribeSwitch: this.isTribeSwitch,
      },
      {
        transaction: transaction,
      }
    );
  }

  /**
   * Get the attributes of the Episode instance.
   */
  getAttributes(): EpisodeAttributes {
    return {
      id: this.id,
      seasonId: this.seasonId,
      number: this.number,
      airDate: this.airDate,
      title: this.title,
      description: this.description,
      type: this.type,
      //isTribeSwitch: this.isTribeSwitch,
      //tribesState: this.tribesState,
    };
  }

  /**
   * Convert the Episode instance to a DTO.
   */
  toDTO(): EpisodeDTO {
    // const translatedTribesState = Object.fromEntries(
    //   Array.from(this.tribesState.entries()).map(([key, value]) => [key, value])
    // );

    return {
      id: this.id,
      seasonId: this.seasonId,
      number: this.number,
      airDate: this.airDate.toISOString(),
      title: this.title,
      description: this.description,
      hasAired: this.hasAired,
      episodeType: this.type,
      //isTribeSwitch: this.isTribeSwitch ?? false,
      isTribeSwitch: false,
      //tribesState: translatedTribesState,
      tribesState: {},
    };
  }
}
