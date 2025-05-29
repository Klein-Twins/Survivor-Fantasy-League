import { SeasonsAttributes } from '../../../models/season/Seasons';
import {
  SurvivorDetailsOnSeasonAttributes,
  SurvivorDetailsOnSeasonTableAttributes,
} from '../../../models/survivors/SurvivorDetailsOnSeason';
import {
  SurvivorsAttributes,
  SurvivorsTableAttributes,
} from '../../../models/survivors/Survivors';
import { DomainModel } from '../../DomainModel';
import {
  SurvivorBasic as SurvivorBasicDTO,
  Survivor as SurvivorDTO,
  SurvivorEliminationType,
} from '../../../generated-api/';

type SeasonSurvivorDependencies = {
  seasonId: SeasonsAttributes['seasonId'];
};

export class SeasonSurvivor extends DomainModel<
  SurvivorsTableAttributes & SurvivorDetailsOnSeasonTableAttributes,
  SeasonSurvivorDependencies,
  SurvivorsAttributes & SurvivorDetailsOnSeasonAttributes,
  SurvivorDTO
> {
  private seasonId: SeasonSurvivorDependencies['seasonId'];
  private id: SurvivorsTableAttributes['id'];
  private firstName: SurvivorsTableAttributes['firstName'];
  private lastName: SurvivorsTableAttributes['lastName'];
  private fromState: SurvivorsTableAttributes['fromState'];
  private fromCity: SurvivorsTableAttributes['fromCity'];
  private fromCountry: SurvivorsTableAttributes['fromCountry'];
  private nickName: SurvivorsTableAttributes['nickName'];
  private age: SurvivorDetailsOnSeasonTableAttributes['age'];
  private description: SurvivorDetailsOnSeasonTableAttributes['description'];
  private job: SurvivorDetailsOnSeasonTableAttributes['job'];

  constructor({
    seasonId,
    id,
    firstName,
    lastName,
    fromState,
    fromCity,
    fromCountry,
    nickName,
    age,
    description,
    job,
  }: SurvivorsTableAttributes &
    SurvivorDetailsOnSeasonTableAttributes &
    SeasonSurvivorDependencies) {
    super();
    this.seasonId = seasonId;
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fromState = fromState;
    this.fromCity = fromCity;
    this.fromCountry = fromCountry;
    this.nickName = nickName;
    this.age = age;
    this.description = description;
    this.job = job;
  }

  toDTO(): SurvivorDTO {
    return {
      id: this.id,
      name: `${this.firstName} ${this.lastName}`,
      seasonId: this.seasonId,
      nickName: this.nickName || null,
      fromCity: this.fromCity || null,
      fromState: this.fromState,
      fromCountry: this.fromCountry,
      age: this.age,
      description: this.description,
      job: this.job,
      firstName: this.firstName,
      lastName: this.lastName,
      finishStatus: {
        isTorchSnuffed: false,
        placement: null,
        placementText: null,
        dayEliminated: null,
        juryPlacement: null,
        juryPlacementText: null,
        episodeIdEliminated: null,
        eliminationType: undefined,
      },
    };
  }

  toBasicDTO(): SurvivorBasicDTO {
    return {
      id: this.id,
      name: `${this.firstName} ${this.lastName}`,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
  getAttributes(): SurvivorsAttributes & SurvivorDetailsOnSeasonAttributes {
    return {
      seasonId: this.seasonId,
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fromState: this.fromState,
      fromCity: this.fromCity,
      fromCountry: this.fromCountry,
      nickName: this.nickName,
      age: this.age,
      description: this.description,
      job: this.job,
    };
  }

  getSurvivorId(): SeasonSurvivor['id'] {
    return this.id;
  }

  getSeasonId(): SeasonSurvivor['seasonId'] {
    return this.seasonId;
  }
}
