import { UUID } from 'crypto';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonEliminationAttributes } from '../../models/season/SeasonEliminations';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import seasonEliminationRepository from '../../repositories/season/seasonEliminationRepository';
import survivorService from './survivorService';
import { EliminationStatus } from '../../generated-api';

const seasonEliminationService = {
  getSurvivorEliminationStatusAtStartOfEpisode,
  getSurvivorEliminationInfo,
  getAllSurvivorsEliminationStatusAtStartOfEpisode,
};

async function getSurvivorEliminationStatusAtStartOfEpisode(
  survivorId: SurvivorsAttributes['id'],
  episodeId: EpisodeAttributes['id']
): Promise<EliminationStatus> {
  const survivorEliminationAttributes =
    await seasonEliminationRepository.getEliminationStatus(
      survivorId,
      episodeId
    );
  return {
    isEliminated: !!survivorEliminationAttributes,
    dayEliminated: survivorEliminationAttributes?.day || null,
    placement: survivorEliminationAttributes?.placement || null,
    episodeEliminated: survivorEliminationAttributes?.episodeId || null,
  };
}

async function getAllSurvivorsEliminationStatusAtStartOfEpisode(
  seasonId: SeasonsAttributes['seasonId'],
  episodeId: EpisodeAttributes['id']
): Promise<Record<SurvivorsAttributes['id'], EliminationStatus>> {
  const survivors = await survivorService.getSurvivorsBySeason(seasonId);
  const survivorIds = survivors.map((survivor) => survivor.id as UUID);
  const seasonEliminationsAttributes =
    await seasonEliminationRepository.getEliminationStatusForSurvivorsByStartOfEpisode(
      survivorIds,
      seasonId,
      episodeId
    );
  return Object.keys(seasonEliminationsAttributes).reduce((acc, survivorId) => {
    const eliminationAttributes =
      seasonEliminationsAttributes[survivorId as SurvivorsAttributes['id']];
    acc[survivorId as SurvivorsAttributes['id']] = buildSurvivorEliminationInfo(
      eliminationAttributes
    );
    return acc;
  }, {} as Record<SurvivorsAttributes['id'], EliminationStatus>);
}

async function getSurvivorEliminationInfo(
  survivorId: SurvivorsAttributes['id'],
  seasonId: SeasonsAttributes['seasonId']
): Promise<EliminationStatus> {
  const seasonEliminationAttributes =
    await seasonEliminationRepository.getSeasonEliminationForSurvivorOnSeason(
      survivorId,
      seasonId
    );
  return buildSurvivorEliminationInfo(seasonEliminationAttributes);
}

function buildSurvivorEliminationInfo(
  seasonEliminationAttributes: SeasonEliminationAttributes | null
): EliminationStatus {
  if (!seasonEliminationAttributes) {
    return {
      isEliminated: false,
      dayEliminated: null,
      placement: null,
      episodeEliminated: null,
    };
  }
  return {
    isEliminated: true,
    dayEliminated: seasonEliminationAttributes.day || null,
    placement: seasonEliminationAttributes.placement || null,
    episodeEliminated: seasonEliminationAttributes.episodeId || null,
  };
}

export default seasonEliminationService;
