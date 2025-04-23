import { Season } from '../../../../../domain/season/Season';
import { EpisodeAttributes } from '../../../../../models/season/Episodes';
import {
  SeedEpisode,
  SeedTribeStartEpisodeEvent,
} from '../../../../foundation/data/ssn/dataTypes';

import tribeProcessor from '../../tribe/tribeProcessor';
import tribalCouncilProcessor from './tribalCouncilProcessor';

const episodeEventProcessor = {
  processEpisodeEvents,
};

function processEpisodeEvents(season: Season, episodeData: SeedEpisode): void {
  if (episodeData.episodeEvents?.tribeStart) {
    processTribeStartEvent(
      season,
      episodeData.episodeInfo.id,
      episodeData.episodeEvents.tribeStart
    );
  }
  if (episodeData.episodeEvents?.tribalCouncil) {
    for (const tribalCouncil of episodeData.episodeEvents.tribalCouncil) {
      tribalCouncilProcessor.processTribalCouncil(
        season,
        episodeData.episodeInfo.id,
        tribalCouncil
      );
    }
  }
}

function processTribeStartEvent(
  season: Season,
  episodeId: EpisodeAttributes['id'],
  tribeStartEvent: SeedTribeStartEpisodeEvent
): void {
  for (const tribeStart of tribeStartEvent) {
    tribeProcessor.processTribeStart(season, episodeId, tribeStart);
  }
}

export default episodeEventProcessor;
