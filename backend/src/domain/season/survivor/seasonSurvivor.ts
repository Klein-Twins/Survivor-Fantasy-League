import { Survivor } from '../../survivor/survivor';
import { SurvivorsAttributes } from '../../../models/survivors/Survivors';
import { Survivor as SurvivorDTO } from '../../../generated-api';
import { SurvivorDetailsOnSeasonAttributes } from '../../../models/survivors/SurvivorDetailsOnSeason';
import {
  SurvivorEliminationStatus,
  SurvivorEliminationStatusTypeDetails,
} from './survivorFinishStatus';

type SeasonSurvivorAttributes = SurvivorsAttributes &
  SurvivorDetailsOnSeasonAttributes;

type SeasonSurvivorDependencies = {
  survivorEliminationStatus: SurvivorEliminationStatus;
};

export class SeasonSurvivor
  extends Survivor
  implements SurvivorDetailsOnSeasonAttributes
{
  id: SurvivorDetailsOnSeasonAttributes['id'];
  seasonId: SurvivorDetailsOnSeasonAttributes['seasonId'];
  age: SurvivorDetailsOnSeasonAttributes['age'];
  description: SurvivorDetailsOnSeasonAttributes['description'];
  job: SurvivorDetailsOnSeasonAttributes['job'];
  survivorEliminationStatus: SurvivorEliminationStatus;

  constructor(
    attributes: SeasonSurvivorAttributes,
    dependencies?: Partial<SeasonSurvivorDependencies>,
    survivorEliminationStatus: SurvivorEliminationStatus = new SurvivorEliminationStatus(
      {
        isTorchSnuffed: false,
        eliminationDetails: null,
      }
    )
  ) {
    super(attributes, dependencies);
    this.id = attributes.id;
    this.seasonId = attributes.seasonId;
    this.age = attributes.age;
    this.description = attributes.description;
    this.job = attributes.job;
    this.survivorEliminationStatus = survivorEliminationStatus;
  }

  protected getDefaultDependencies(): SeasonSurvivorDependencies {
    return {
      ...super.getDefaultDependencies(), // Include Survivor's default dependencies
      survivorEliminationStatus: new SurvivorEliminationStatus({
        isTorchSnuffed: false,
        eliminationDetails: null,
      }),
    };
  }

  getSurvivorEliminationStatus(): SurvivorEliminationStatus {
    return this.survivorEliminationStatus;
  }

  eliminate(
    survivorEliminationStatusTypeDetails: SurvivorEliminationStatusTypeDetails
  ) {
    this.survivorEliminationStatus.setElimination(
      survivorEliminationStatusTypeDetails
    );
  }

  getAttributes(): SeasonSurvivorAttributes {
    return {
      ...super.getAttributes(),
      id: this.id,
      seasonId: this.seasonId,
      age: this.age,
      description: this.description,
      job: this.job,
    };
  }

  toDTO(): SurvivorDTO {
    return {
      ...super.toDTO(),
      fromCountry: this.attributes.fromCountry,
      fromState: this.attributes.fromState,
      fromCity: this.attributes.fromCity,
      nickName: this.attributes.nickName,
      seasonId: this.seasonId,
      age: this.age,
      description: this.description,
      job: this.job,
      finishStatus: this.survivorEliminationStatus?.toDTO() || {
        isTorchSnuffed: false,
        placement: null,
        placementText: null,
        dayEliminated: null,
        juryPlacement: null,
        juryPlacementText: null,
        episodeIdEliminated: null,
      },
    };
  }
}
