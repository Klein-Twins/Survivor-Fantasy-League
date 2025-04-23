import {
  TribalCouncilAttributes,
  TribalCouncilDependencyAttributes,
  TribalCouncilTableAttributes,
} from '../../../../models/season/tribalCouncil/TribalCouncil';
import { DomainModel } from '../../../DomainModel';
import { Tribe } from '../../tribe/Tribe';
import { SeasonSurvivor } from '../../survivor/SeasonSurvivor';

type TribalCouncilDependencies = {
  attendingTribe: Tribe | null;
  episodeId: TribalCouncilDependencyAttributes['episodeId'];
  attendingSurvivors: SeasonSurvivor[];
  eliminatedSurvivor: SeasonSurvivor;
};

export class TribalCouncil extends DomainModel<
  TribalCouncilTableAttributes,
  TribalCouncilDependencies
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

  getAttributes(): TribalCouncilTableAttributes & TribalCouncilDependencies {
    return {
      id: this.id,
      day: this.day,
      attendingTribe: this.attendingTribe,
      episodeId: this.episodeId,
      attendingSurvivors: this.attendingSurvivors,
      eliminatedSurvivor: this.eliminatedSurvivor,
      seq: this.seq,
    };
  }
}
