import { inject, injectable } from 'tsyringe';
import { EpisodeEvents } from '../../../../domain/season/episode/events/EpisodeEvents';
import { Transaction } from 'sequelize';
import { TribalCouncilService } from './TribalCouncilService';
import { TribeService } from '../../tribe/TribeService';
import { TribeStartService } from './TribeStartService';
import { TribeStart } from '../../../../domain/season/episode/events/TribeStart';
import { SeasonStorage } from '../../../../domain/season/Season';
import { Episode } from '../../../../domain/season/episode/Episode';
import { TribalCouncil } from '../../../../domain/season/episode/events/TribalCouncil';

// export type TribeStartEvent = TribeStart[];

// export type TribeStart = Omit<
//   TribeAttributes,
//   'seasonId' | 'episodeIdStart' | 'episodeIdEnd' | 'mergeTribe'
// > & {
//   startingSurvivors: SurvivorsAttributes['id'][];
// };

@injectable()
export class EpisodeEventService {
  constructor(
    @inject(SeasonStorage)
    private seasonStorage: SeasonStorage,
    @inject(TribalCouncilService)
    private tribalCouncilService: TribalCouncilService,
    @inject(TribeService)
    private tribeService: TribeService,
    @inject(TribeStartService)
    private tribeStartService: TribeStartService
  ) {}

  async fetchEpisodeEvents(episode: Episode): Promise<EpisodeEvents> {
    const episodeEvents = episode.getEpisodeEvents();
    const episodeId = episode.getAttributes().id;

    const tribeStarts: TribeStart[] =
      await this.tribeStartService.fetchTribeStartsEventOnEpisode(episode);
    const tribalCouncils: TribalCouncil[] =
      await this.tribalCouncilService.fetchTribalCouncilEventsOnEpisode(
        episode
      );

    return episodeEvents;
  }

  async saveEpisodeEvents(
    episodeEvents: EpisodeEvents,
    transaction: Transaction
  ) {
    const tribesStart = episodeEvents.getTribesStart();
    if (tribesStart.length > 0) {
      await this.tribeStartService.saveTribeStarts(tribesStart, transaction);
    }

    const tribalCouncils = episodeEvents.getTribalCouncils();
    if (tribalCouncils.length > 0) {
      await this.tribalCouncilService.saveTribalCouncilsOnEpisode(
        tribalCouncils,
        transaction
      );
    }
  }
}
