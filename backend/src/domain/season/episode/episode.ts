// --- Imports ---
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { DomainModel } from '../../domainModel';
import { Episode as EpisodeDTO } from '../../../generated-api/models/episode';
import { Tribe } from '../tribe/tribeBackup';
import { SeasonSurvivor } from '../survivor/seasonSurvivorBackuo';

// // --- Type Definitions ---
// export type EpisodeProperties = EpisodeAttributes & {
//   hasAired: boolean;
//   tribesState: Map<Tribe, TribeState> | null;
//   // isTribeSwitch: EpisodeAttributes['isTribeSwitch'];
//   // tribesState: Map<TribeAttributes['id'], TribeMembersState>;
// };

// export type TribeState = {
//   atEpisodeStart: Array<SeasonSurvivor>;
//   atEpisodeBeforeTribal: Array<SeasonSurvivor>;
//   atEpisodeEnd: Array<SeasonSurvivor>;
// };

export type EpisodeDependencies = {};

export class Episode extends DomainModel<
  EpisodeAttributes,
  EpisodeDependencies,
  EpisodeDTO
> {
  constructor(
    attributes: EpisodeAttributes,
    dependencies?: Partial<EpisodeDependencies>
  ) {
    super(attributes, dependencies);
  }

  protected getDefaultDependencies(): EpisodeDependencies {
    return {};
  }

  toDTO(): EpisodeDTO {
    // const translatedTribesState = Object.fromEntries(
    //   Array.from(this.tribesState.entries()).map(([key, value]) => [key, value])
    // );

    return {
      id: this.attributes.id,
      seasonId: this.attributes.seasonId,
      number: this.attributes.number,
      airDate: this.attributes.airDate.toISOString(),
      title: this.attributes.title,
      description: this.attributes.description,
      hasAired: this.attributes.airDate < new Date(),
      episodeType: this.attributes.type,
      //isTribeSwitch: this.isTribeSwitch ?? false,
      isTribeSwitch: false,
      //tribesState: translatedTribesState,
      tribesState: {},
    };
  }
}

// // --- Class Definition ---
// export class Episode implements DomainModel<EpisodeAttributes, EpisodeDependencies, EpisodeDTO> {
//   // --- Core Properties ---
//   private id: EpisodeAttributes['id'];
//   private seasonId: EpisodeAttributes['seasonId'];
//   private number: EpisodeAttributes['number'];
//   private airDate: EpisodeAttributes['airDate'];
//   private title: EpisodeAttributes['title'];
//   private description: EpisodeAttributes['description'];
//   private type: EpisodeAttributes['type'];
//   private hasAired: boolean;
//   //private tribesState: EpisodeProperties['tribesState'];
//   //private isTribeSwitch: EpisodeAttributes['isTribeSwitch'];
//   //private tribesState: Map<TribeAttributes['id'], TribeMembersState>;

//   // --- Constructor ---
//   constructor(episodePropertyValues: EpisodeProperties) {
//     this.id = episodePropertyValues.id;
//     this.seasonId = episodePropertyValues.seasonId;
//     this.number = episodePropertyValues.number;
//     this.airDate = episodePropertyValues.airDate;
//     this.title = episodePropertyValues.title;
//     this.description = episodePropertyValues.description;
//     this.type = episodePropertyValues.type;
//     this.hasAired = new Date() > new Date(episodePropertyValues.airDate);
//     //this.tribesState = episodePropertyValues.tribesState || null;
//     //this.isTribeSwitch = episodePropertyValues.isTribeSwitch;
//   }

//   // --- Static Methods ---
//   /**
//    * Find an episode by its ID.
//    */
//   static async findById(id: EpisodeAttributes['id']): Promise<Episode> {
//     const episodeData: EpisodeAttributes | null = await models.Episode.findByPk(
//       id
//     );
//     if (!episodeData) {
//       throw new Error(`Episode with ID ${id} not found`);
//     }

//     return Episode.fromAttributes(episodeData);
//   }

//   /**
//    * Find an episode by its season ID and episode number.
//    */
//   static async findBySeasonIdAndEpisodeNumber(
//     seasonId: EpisodeAttributes['seasonId'],
//     episodeNumber: EpisodeAttributes['number']
//   ): Promise<Episode> {
//     const episodeData = await models.Episode.findOne({
//       where: {
//         seasonId,
//         number: episodeNumber,
//       },
//     });
//     if (!episodeData) {
//       throw new Error(
//         `Episode with season ID ${seasonId} and episode number ${episodeNumber} not found`
//       );
//     }
//     return Episode.findById(episodeData.id);
//   }

//   /**
//    * Find all episodes by season ID.
//    */
//   static async findAllEpisodesBySeasonId(
//     seasonId: EpisodeAttributes['seasonId']
//   ): Promise<Episode[]> {
//     const episodesData = await models.Episode.findAll({
//       where: {
//         seasonId,
//       },
//     });

//     const episodes: Episode[] = [];
//     for (const episodeData of episodesData) {
//       const episode = await Episode.findById(episodeData.id);
//       episodes.push(episode);
//     }
//     return episodes;
//   }

//   /**
//    * Fetch the tribes state on the episode and attach to the episode instance.
//    */
//   // async fetchTribesStateOnEpisode(
//   //   tribes: Tribe[],
//   //   survivors: SeasonSurvivor[]
//   // ): Promise<void> {
//   //   const tribesState: Map<Tribe, TribeState> = new Map<Tribe, TribeState>();

//   //   for (const tribe of tribes) {
//   //     const tribeMemberStateTem: TribeMembersState =
//   //       await tribeMemberService.getTribeState(
//   //         tribe.getAttributes().id,
//   //         this.id
//   //       );

//   //     const atEpisodeStart = tribeMemberStateTem.tribeMembersAtEndOfEpisode.map(
//   //       (survivor) => {
//   //         const survivorId = survivor.id;
//   //         const tribeMember = survivors.find(
//   //           (s) => s.getAttributes().id === survivorId
//   //         );
//   //         if (!tribeMember) {
//   //           throw new InternalServerError(
//   //             `Survivor with ID ${survivorId} not found in survivors list`
//   //           );
//   //         }
//   //         return tribeMember;
//   //       }
//   //     );

//   //     const atEpisodeBeforeTribal =
//   //       tribeMemberStateTem.tribeMembersBeforeElimination.map((survivor) => {
//   //         const survivorId = survivor.id;
//   //         const tribeMember = survivors.find(
//   //           (s) => s.getAttributes().id === survivorId
//   //         );
//   //         if (!tribeMember) {
//   //           throw new InternalServerError(
//   //             `Survivor with ID ${survivorId} not found in survivors list`
//   //           );
//   //         }
//   //         return tribeMember;
//   //       });

//   //     const atEpisodeEnd = tribeMemberStateTem.tribeMembersAtEndOfEpisode.map(
//   //       (survivor) => {
//   //         const survivorId = survivor.id;
//   //         const tribeMember = survivors.find(
//   //           (s) => s.getAttributes().id === survivorId
//   //         );
//   //         if (!tribeMember) {
//   //           throw new InternalServerError(
//   //             `Survivor with ID ${survivorId} not found in survivors list`
//   //           );
//   //         }
//   //         return tribeMember;
//   //       }
//   //     );

//   //     tribesState.set(tribe, {
//   //       atEpisodeStart: atEpisodeStart,
//   //       atEpisodeBeforeTribal: atEpisodeBeforeTribal,
//   //       atEpisodeEnd: atEpisodeEnd,
//   //     });
//   //   }
//   //   this.tribesState = tribesState;
//   // }

//   /**
//    * Create an Episode instance from attributes.
//    */
//   static fromAttributes(
//     episodePropertyValues: Omit<EpisodeProperties, 'hasAired' | 'tribesState'>
//   ): Episode {
//     return new Episode({
//       id: episodePropertyValues.id,
//       seasonId: episodePropertyValues.seasonId,
//       number: episodePropertyValues.number,
//       airDate: episodePropertyValues.airDate,
//       title: episodePropertyValues.title,
//       description: episodePropertyValues.description,
//       hasAired: new Date() > new Date(episodePropertyValues.airDate),
//       type: episodePropertyValues.type,
//       tribesState: null,
//       //isTribeSwitch: episodeAttributes.isTribeSwitch ?? false,
//       //tribesState: tribeToTribeMembershipOnEpisode,
//     });
//   }

//   // --- Instance Methods ---
//   /**
//    * Save the Episode instance to the database.
//    */
//   @Transactional()
//   async save(transaction?: Transaction): Promise<void> {
//     await models.Episode.upsert(
//       {
//         id: this.id,
//         seasonId: this.seasonId,
//         number: this.number,
//         airDate: this.airDate,
//         title: this.title,
//         description: this.description,
//         type: this.type,
//         //isTribeSwitch: this.isTribeSwitch,
//       },
//       {
//         transaction: transaction,
//       }
//     );
//   }

//   /**
//    * Get the attributes of the Episode instance.
//    */
//   getAttributes(): EpisodeAttributes {
//     return {
//       id: this.id,
//       seasonId: this.seasonId,
//       number: this.number,
//       airDate: this.airDate,
//       title: this.title,
//       description: this.description,
//       type: this.type,
//       //isTribeSwitch: this.isTribeSwitch,
//       //tribesState: this.tribesState,
//     };
//   }

//   /**
//    * Convert the Episode instance to a DTO.
//    */
//   toDTO(): EpisodeDTO {
//     // const translatedTribesState = Object.fromEntries(
//     //   Array.from(this.tribesState.entries()).map(([key, value]) => [key, value])
//     // );

//     return {
//       id: this.id,
//       seasonId: this.seasonId,
//       number: this.number,
//       airDate: this.airDate.toISOString(),
//       title: this.title,
//       description: this.description,
//       hasAired: this.hasAired,
//       episodeType: this.type,
//       //isTribeSwitch: this.isTribeSwitch ?? false,
//       isTribeSwitch: false,
//       //tribesState: translatedTribesState,
//       tribesState: {},
//     };
//   }
// }
