import {
  TribalCouncilAttributes,
  TribalCouncilDependencyAttributes,
  TribalCouncilTableAttributes,
} from '../../../../models/season/tribalCouncil/TribalCouncil';
import { DomainModel } from '../../../DomainModel';
import { Tribe } from '../../tribe/Tribe';
import { SeasonSurvivor } from '../../survivor/SeasonSurvivor';
import { TribalCouncilSurvivorsAttributes } from '../../../../models/season/tribalCouncil/TribalCouncilSurvivors';

type TribalCouncilDependencies = {
  attendingTribe: Tribe | null;
  episodeId: TribalCouncilDependencyAttributes['episodeId'];
  attendingSurvivors: SeasonSurvivor[];
  eliminatedSurvivor: SeasonSurvivor;
};

export class TribalCouncil extends DomainModel<
  TribalCouncilTableAttributes,
  TribalCouncilDependencies,
  TribalCouncilAttributes & {
    tribalCouncilSurvivorAttributes: TribalCouncilSurvivorsAttributes[];
  }
> {
  private id: TribalCouncilAttributes['id'];
  private day: TribalCouncilAttributes['day'];
  private attendingTribe: TribalCouncilDependencies['attendingTribe'];
  private episodeId: TribalCouncilDependencies['episodeId'];
  private attendingSurvivors: SeasonSurvivor[];
  private eliminatedSurvivor: SeasonSurvivor;
  private seq: TribalCouncilAttributes['seq'];

  constructor({
    id,
    day,
    attendingTribe,
    episodeId,
    attendingSurvivors,
    eliminatedSurvivor,
    seq,
  }: TribalCouncilTableAttributes & TribalCouncilDependencies) {
    super();
    this.id = id;
    this.day = day;
    this.attendingTribe = attendingTribe;
    this.episodeId = episodeId;
    this.attendingSurvivors = attendingSurvivors;
    this.eliminatedSurvivor = eliminatedSurvivor;
    this.seq = seq;
  }

  toDTO(): void {
    throw new Error('Method not implemented.');
  }

  getAttendingTribe(): Tribe | null {
    return this.attendingTribe;
  }

  getAttendingSurvivors(): SeasonSurvivor[] {
    return this.attendingSurvivors;
  }

  getEliminatedSurvivor(): SeasonSurvivor {
    return this.eliminatedSurvivor;
  }

  getAttributes(): TribalCouncilAttributes & {
    tribalCouncilSurvivorAttributes: TribalCouncilSurvivorsAttributes[];
  } {
    return {
      id: this.id,
      day: this.day,
      attendingTribeId: this.attendingTribe?.getAttributes().id || null,
      episodeId: this.episodeId,
      seq: this.seq,
      tribalCouncilSurvivorAttributes: this.attendingSurvivors.map(
        (attendingSurvivor) => {
          return {
            tribalCouncilId: this.id,
            survivorId: attendingSurvivor.getAttributes().id,
          };
        }
      ),
    };
  }
}
