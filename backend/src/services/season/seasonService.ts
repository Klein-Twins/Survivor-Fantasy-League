import { models } from '../../config/db';
import { Episode, Season, Survivor, Tribe } from '../../generated-api';
import { SeasonsAttributes } from '../../models/season/Seasons';
import seasonRepository from '../../repositories/season/seasonRepository';
import { NotFoundError } from '../../utils/errors/errors';
import episodeService from './episodeService';
import survivorService from './survivorService';
import tribeService from './tribeService';

const seasonService = {
  getAllSeasons,
  buildSeason,
};

async function getAllSeasons(): Promise<Season[]> {
  const seasonsAttributes: SeasonsAttributes[] =
    await seasonRepository.getAllSeasons();
  if (seasonsAttributes.length === 0) {
    throw new NotFoundError('No seasons found');
  }

  const seasons: Season[] = [];
  for (const seasonAttributes of seasonsAttributes) {
    seasons.push(await buildSeason(seasonAttributes));
  }

  return seasons;
}

async function buildSeason(seasonInfo: SeasonsAttributes): Promise<Season> {
  const seasonAttributes: SeasonsAttributes = {
    seasonId: Number(seasonInfo.seasonId),
    name: seasonInfo.name,
    startDate: new Date(seasonInfo.startDate),
    endDate: new Date(seasonInfo.endDate),
    location: seasonInfo.location,
    theme: seasonInfo.theme,
    isActive: seasonInfo.isActive,
  };

  const survivors: Survivor[] = await survivorService.getSurvivorsBySeason(
    seasonInfo.seasonId
  );
  const tribes: Tribe[] = await tribeService.getTribesBySeasonId(
    seasonInfo.seasonId
  );
  const episodes: Episode[] = await episodeService.getEpisodesBySeasonId(
    seasonInfo.seasonId
  );

  return {
    id: seasonAttributes.seasonId,
    name: seasonAttributes.name,
    startDate: seasonAttributes.startDate.toString(),
    endDate: seasonAttributes.endDate.toString(),
    location: seasonAttributes.location,
    theme: seasonAttributes.theme,
    isActive: seasonAttributes.isActive,
    survivors: survivors,
    tribes: tribes,
    episodes: episodes,
  };
}

export default seasonService;
