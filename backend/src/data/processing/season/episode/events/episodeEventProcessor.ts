import { Season } from '../../../../../domain/season/Season';
import { EpisodeAttributes } from '../../../../../models/season/Episodes';
import {
  SeedEpisode,
  SeedTribeStartEpisodeEvent,
} from '../../../../foundation/data/ssn/dataTypes';

import tribeProcessor from '../../tribe/tribeProcessor';

const episodeEventProcessor = {
  processEpisodeEvents,
};

async function processEpisodeEvents(
  season: Season,
  episodeData: SeedEpisode
): Promise<void> {
  if (episodeData.episodeEvents?.tribeStart) {
    processTribeStartEvent(
      season,
      episodeData.episodeInfo.id,
      episodeData.episodeEvents.tribeStart
    );
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
