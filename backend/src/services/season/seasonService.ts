import { models } from '../../config/db';
import { Episode, Season, Survivor, Tribe } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import {
  SeasonsAttributes,
  SeasonsCreationAttributes,
} from '../../models/season/Seasons';
import seasonRepository from '../../repositories/season/seasonRepository';
import { InternalServerError, NotFoundError } from '../../utils/errors/errors';
import episodeService from './episodeService';
import survivorService from './survivorService';
import tribeService from './tribeService';
import validator from 'validator';

const seasonService = {
  getAllSeasons,
  getSeason,
  doesSeasonExist,
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

async function getSeason(
  field: 'episodeId' | 'seasonId',
  value: EpisodeAttributes['id'] | SeasonsAttributes['seasonId']
): Promise<Season> {
  let seasonId: SeasonsAttributes['seasonId'];

  if (field === 'episodeId') {
    if (typeof value !== 'string' || !validator.isUUID(value)) {
      throw new InternalServerError(
        `seasonService.getSeason(): Invalid value for episodeId: ${value} when field is ${field}`
      );
    }
    const episode = await episodeService.getEpisode(field, value);
    seasonId = episode.seasonId;
  } else if (field === 'seasonId') {
    if (typeof value !== 'number') {
      throw new InternalServerError(
        `seasonService.getSeason(): Invalid value for seasonId: ${value} when field is ${field}`
      );
    }
    seasonId = value;
  } else {
    throw new InternalServerError(
      `seasonService.getSeason(): Invalid field: ${field}`
    );
  }
  const seasonAttributes: SeasonsAttributes | null =
    await seasonRepository.getSeasonById(seasonId);
  if (!seasonAttributes) {
    throw new NotFoundError(`No season found for ${field}: ${value}`);
  }

  return await buildSeason(seasonAttributes);
}

async function doesSeasonExist(seasonId: number): Promise<boolean> {
  const seasonAttributes = await seasonRepository.getSeasonById(seasonId);
  return seasonAttributes !== null;
}

async function buildSeason(seasonInfo: SeasonsAttributes): Promise<Season> {
  const seasonAttributes: SeasonsAttributes = {
    seasonId: Number(seasonInfo.seasonId),
    name: seasonInfo.name,
    startDate: seasonInfo.startDate ? new Date(seasonInfo.startDate) : null,
    endDate: seasonInfo.endDate ? new Date(seasonInfo.endDate) : null,
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

  const sortedEpisodes = episodes.sort((a, b) => {
    return a.number - b.number;
  });

  const nextEpisodeId =
    sortedEpisodes.find((episode) => {
      if (!episode.hasAired) {
        return episode.id;
      }
    })?.id || null;

  return {
    id: seasonAttributes.seasonId,
    name: seasonAttributes.name,
    startDate: seasonAttributes.startDate?.toString() || null,
    endDate: seasonAttributes.endDate?.toString() || null,
    location: seasonAttributes.location,
    theme: seasonAttributes.theme,
    isActive: seasonAttributes.isActive,
    survivors: survivors,
    tribesInSeason: tribes,
    episodes: episodes,
    nextEpisode: nextEpisodeId,
  };
}

export default seasonService;
