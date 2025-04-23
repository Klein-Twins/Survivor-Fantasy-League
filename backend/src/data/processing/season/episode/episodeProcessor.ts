import { Episode } from '../../../../domain/season/episode/Episode';
import { Season } from '../../../../domain/season/Season';
import episodeEventProcessor from './events/episodeEventProcessor';
import { SeedEpisode } from '../../../foundation/data/ssn/dataTypes';

const episodeProcessor = {
  processEpisode,
};

function processEpisode(season: Season, episodeData: SeedEpisode): void {
  const episode: Episode = new Episode({
    id: episodeData.episodeInfo.id,
    number: episodeData.episodeInfo.number,
    title: episodeData.episodeInfo.title,
    airDate: episodeData.episodeInfo.airDate,
    description: episodeData.episodeInfo.description,
    type: episodeData.episodeInfo.type,
    seasonId: season.getAttributes().seasonId,
  });

  season.addEpisode(episode);

  episodeEventProcessor.processEpisodeEvents(season, episodeData);
}

export default episodeProcessor;
