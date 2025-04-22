import { inject, injectable } from 'tsyringe';
import { SeasonEliminationAttributes } from '../../../../models/season/SeasonEliminations';
import { Season } from '../../../../domain/season/season';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { SurvivorEliminationService } from '../../survivor/survivorEliminationService';
import { SurvivorEliminationEvent } from '../../../../data/foundation/data/ssn/dataTypes';

export type SurvivorEliminationDetails = {
  day: SeasonEliminationAttributes['day'];
  survivorId: SeasonEliminationAttributes['survivorId'];
  notes: SeasonEliminationAttributes['notes'];
  seq: SeasonEliminationAttributes['seq'];
  placement: SeasonEliminationAttributes['placement'];
  juryPlacement: SeasonEliminationAttributes['juryPlacement'];
  type: SeasonEliminationAttributes['type'];
};

@injectable()
export class SurvivorEliminationEventService {
  constructor(
    @inject(SurvivorEliminationService)
    private survivorEliminationService: SurvivorEliminationService
  ) {}

  processSurvivorEliminationEvent(
    season: Season,
    episodeId: EpisodeAttributes['id'],
    survivorEliminationEvent: SurvivorEliminationEvent
  ) {
    const episode = season.getEpisodeById(episodeId);

    for (const elimination of survivorEliminationEvent) {
      this.survivorEliminationService.processSurvivorElimination(
        season,
        episode,
        elimination
      );
    }
  }
}
