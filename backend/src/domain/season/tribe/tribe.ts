import { SeasonsAttributes } from '../../../models/season/Seasons';
import {
  TribeAttributes,
  TribeTableAttributes,
} from '../../../models/season/Tribes';
import { DomainModel2 } from '../../domainModel';
import { Episode } from '../episode/episode';
import { Tribe as TribeDTO } from '../../../generated-api/models/tribe';
import { TribeMemberHistory } from './tribeMemberHistory';

export type TribeDependencies = {
  seasonId: SeasonsAttributes['seasonId'];
  episodeStart: Episode;
  episodeEnd: Episode | null;
  memberHistory: TribeMemberHistory;
};

export class Tribe
  extends DomainModel2<TribeTableAttributes, TribeDependencies, TribeDTO>
  implements TribeTableAttributes, TribeDependencies
{
  private seasonId: SeasonsAttributes['seasonId'];
  private episodeStart: Episode;
  private episodeEnd: Episode | null;
  private id: TribeAttributes['id'];
  private name: TribeAttributes['name'];
  private color: TribeAttributes['color'];
  private hexColor: TribeAttributes['hexColor'];
  private mergeTribe: TribeAttributes['mergeTribe'];
  private memberHistory: TribeMemberHistory;

  constructor({
    seasonId,
    episodeStart,
    episodeEnd,
    id,
    name,
    color,
    hexColor,
    mergeTribe,
  }: TribeTableAttributes & TribeDependencies) {
    super();
    this.seasonId = seasonId;
    this.episodeStart = episodeStart;
    this.episodeEnd = episodeEnd;
    this.id = id;
    this.name = name;
    this.color = color;
    this.hexColor = hexColor;
    this.mergeTribe = mergeTribe;
    this.memberHistory = new TribeMemberHistory();
  }

  toDTO(): TribeDTO {
    return {
      id: this.id,
      name: this.name,
      color: {
        name: this.color,
        hex: this.hexColor,
      },
      isMergeTribe: this.mergeTribe,
      episodeStarted: this.episodeStart.toDTO().id || null,
      //episodeEnded: this.episodeEnd?.toDTO().id || null,
      startingSurvivors: [],
    };
  }
  getAttributes(): TribeTableAttributes & TribeDependencies {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      hexColor: this.hexColor,
      mergeTribe: this.mergeTribe,
      seasonId: this.seasonId,
      episodeStart: this.episodeStart,
      episodeEnd: this.episodeEnd,
      memberHistory: this.memberHistory,
    };
  }
}

// import { TribeAttributes } from '../../../models/season/Tribes';
// import { DomainModel } from '../../domainModel';
// import { Tribe as TribeDTO } from '../../../generated-api/models/tribe';
// import { Episode } from '../episode/episode';
// import { SeasonSurvivor } from '../survivor/seasonSurvivor';
// type TribeDependencies = {
//   episodeStart: Episode | null;
//   episodeEnded: Episode | null;
//   startingTribeMembers: SeasonSurvivor[];
// };

// export class Tribe extends DomainModel<
//   Omit<TribeAttributes, 'seasonId' | 'episodeIdStart' | 'episodeIdEnd'>,
//   TribeDependencies,
//   TribeDTO
// > {
//   constructor(
//     attributes: TribeAttributes,
//     dependencies?: Partial<TribeDependencies>
//   ) {
//     super(attributes, dependencies);
//   }

//   toDTO(): TribeDTO {
//     return {
//       id: this.attributes.id,
//       name: this.attributes.name,
//       color: {
//         name: this.attributes.color,
//         hex: this.attributes.hexColor,
//       },
//       isMergeTribe: this.attributes.mergeTribe,
//       episodeStarted: this.dependencies.episodeStart?.toDTO().id || null,
//       startingSurvivors: this.dependencies.startingTribeMembers.map(
//         (startingTribeMember) => startingTribeMember.toDTO()
//       ),
//     };
//   }

//   start(episode: Episode): void {
//     if (this.dependencies.episodeStart) {
//       throw new Error(
//         `Tribe ${this.attributes.name} already has a start episode set`
//       );
//     }
//     this.dependencies.episodeStart = episode;
//   }

//   end(episode: Episode): void {
//     if (this.dependencies.episodeStart === null) {
//       throw new Error(
//         `Tribe ${this.attributes.name} has not started yet, cannot end`
//       );
//     }
//     if (this.dependencies.episodeEnded) {
//       throw new Error(
//         `Tribe ${this.attributes.name} already has an end episode set`
//       );
//     }
//     this.dependencies.episodeEnded = episode;
//   }

//   addStartingSurvivor(survivor: SeasonSurvivor): void {
//     if (
//       this.dependencies.startingTribeMembers.some(
//         (s) => s.getAttributes().id === survivor.getAttributes().id
//       )
//     ) {
//       throw new Error(
//         `Survivor ${survivor.getName()} is already in the starting survivors list for tribe ${
//           this.attributes.name
//         }`
//       );
//     }
//     this.dependencies.startingTribeMembers.push(survivor);
//   }

//   protected getDefaultDependencies(): TribeDependencies {
//     return {
//       episodeStart: null,
//       episodeEnded: null,
//       startingTribeMembers: [],
//     };
//   }
// }
