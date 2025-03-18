import { UUID } from 'crypto';
import { SurvivorEliminationInfo } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonEliminationAttributes } from '../../models/season/SeasonEliminations';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import seasonEliminationRepository from '../../repositories/season/seasonEliminationRepository';
import survivorService from './survivorService';

const seasonEliminationService = {
  getSurvivorEliminationInfo,
  getAllSurvivorsEliminationStatusAtStartOfEpisode,
};

async function getAllSurvivorsEliminationStatusAtStartOfEpisode(
  seasonId: SeasonsAttributes['seasonId'],
  episodeId: EpisodeAttributes['episodeId']
): Promise<Record<SurvivorsAttributes['id'], SurvivorEliminationInfo>> {
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
  }, {} as Record<SurvivorsAttributes['id'], SurvivorEliminationInfo>);
}

async function getSurvivorEliminationInfo(
  survivorId: SurvivorsAttributes['id'],
  seasonId: SeasonsAttributes['seasonId']
): Promise<SurvivorEliminationInfo> {
  const seasonEliminationAttributes =
    await seasonEliminationRepository.getSeasonEliminationForSurvivorOnSeason(
      survivorId,
      seasonId
    );
  return buildSurvivorEliminationInfo(seasonEliminationAttributes);
}

function buildSurvivorEliminationInfo(
  seasonEliminationAttributes: SeasonEliminationAttributes | null
): SurvivorEliminationInfo {
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
