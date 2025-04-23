import { Season } from '../../../../domain/season/Season';
import { Tribe } from '../../../../domain/season/tribe/Tribe';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { SeedTribeStart } from '../../../foundation/data/ssn/dataTypes';

const tribeProcessor = {
  processTribeStart,
};

function processTribeStart(
  season: Season,
  episodeId: EpisodeAttributes['id'],
  tribeData: SeedTribeStart
): void {
  const episode = season.getEpisodeById(episodeId);
  const tribe = new Tribe({
    seasonId: season.getAttributes().seasonId,
    id: tribeData.id,
    name: tribeData.name,
    color: tribeData.color,
    hexColor: tribeData.hexColor,
    mergeTribe: episode.getAttributes().number === 1 ? false : true,
    episodeStart: episode,
    episodeEnd: null,
  });

  season.addTribe(tribe);
}

export default tribeProcessor;
