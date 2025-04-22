import { SeasonEliminationAttributes } from '../../../models/season/SeasonEliminations';
import { DomainModel } from '../../domainModel';
import { SurvivorFinishStatus } from '../../../generated-api';
import { Episode } from '../episode/episode';

type SurvivorEliminationDependencies = {
  episodeEliminated: Episode;
};

export class SurvivorEliminationInfo extends DomainModel<
  Omit<SeasonEliminationAttributes, 'survivorId' | 'seasonId' | 'episodeId'>,
  SurvivorEliminationDependencies,
  SurvivorFinishStatus
> {
  constructor(
    attributes: Omit<
      SeasonEliminationAttributes,
      'survivorId' | 'seasonId' | 'episodeId'
    >,
    dependencies?: Partial<SurvivorEliminationDependencies>
  ) {
    // Ensure dependencies are passed correctly
    super(attributes, dependencies);
  }

  toDTO(): SurvivorFinishStatus {
    return {
      ...this.getAttributes(),
    };
  }

  protected getDefaultDependencies(): SurvivorEliminationDependencies {
    return {
      episodeEliminated: null as unknown as Episode, // Default to null or a placeholder
    };
  }
}
