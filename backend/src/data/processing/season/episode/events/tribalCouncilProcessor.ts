import { TribalCouncil } from '../../../../../domain/season/episode/events/TribalCouncil';
import { Season } from '../../../../../domain/season/Season';
import { Tribe } from '../../../../../domain/season/tribe/Tribe';
import { EpisodeAttributes } from '../../../../../models/season/Episodes';
import { SeedTribalCouncil } from '../../../../foundation/data/ssn/dataTypes';

const tribalCouncilProcessor = {
  processTribalCouncil,
};

function processTribalCouncil(
  season: Season,
  episodeId: EpisodeAttributes['id'],
  tribalCouncilData: SeedTribalCouncil
): void {
  const {
    attendingTribeId,
    eliminatedSurvivorId,
    attendingSurvivorIds,
    id,
    day,
    seq,
  } = tribalCouncilData;

  const episode = season.getEpisodeById(episodeId);
  const episodeEvents = episode.getEpisodeEvents();

  const attendingTribe: Tribe | null = attendingTribeId
    ? season.getTribeById(attendingTribeId)
    : null;

  const eliminatedSurvivor = season.getSurvivorById(eliminatedSurvivorId);

  const tribalCouncil: TribalCouncil = new TribalCouncil({
    id: id,
    day: day,
    attendingTribe: attendingTribe,
    episodeId: episodeId,
    attendingSurvivors: [],
    eliminatedSurvivor: eliminatedSurvivor,
    seq: seq,
  });

  episodeEvents.addTribalCouncil(tribalCouncil);
}

export default tribalCouncilProcessor;
