import { validate } from 'uuid';
import episodeRepository from '../../repositories/season/episodeRepository';
import { Episode } from '../../generated-api';
import { UUID } from 'crypto';
import { BadRequestError, NotFoundError, NotImplementedError } from '../../utils/errors/errors';

const episodeService = {
  //doesEpisodeExist,
  validateEpisodeIsInSeason,
  getEpisode,
  getEpisodeIdsBySeasonAndEpisodeNumber,
};

async function validateEpisodeIsInSeason(episodeId: string, seasonId: number): Promise<void> {
  const episode = await episodeRepository.getEpisodeByEpisodeId(episodeId);
  if (!episode) {
    throw new NotFoundError('Episode not found');
  }
  const seasonIdTiedToEpisode = episode.seasonId;
  if (seasonIdTiedToEpisode !== seasonId) {
    throw new NotFoundError('Episode not found');
  }
}

function getNextEpisode() {
  throw new NotImplementedError();
}
function getCurrentEpisode() {
  throw new NotImplementedError();
}
async function getEpisodeIdsBySeasonAndEpisodeNumber(
  seasonId: number,
  episodeNumber: number | number[]
): Promise<UUID[]> {
  return await episodeRepository.getEpisodeIdsBySeasonAndEpisodeNumber(seasonId, episodeNumber);
}

function setCurrentEpisode() {
  throw new NotImplementedError();
}

function hasEpisodeAired() {
  throw new NotImplementedError();
}

async function getEpisode(episodeId: string): Promise<Episode> {
  if (validate(episodeId) === false) {
    throw new BadRequestError('Invalid episodeId');
  }
  const episode = await episodeRepository.getEpisodeByEpisodeId(episodeId);
  if (!episode) {
    throw new BadRequestError('Episode does not exist');
  }

  return {
    id: episode.episodeId,
    seasonId: episode.seasonId,
    episodeNumber: episode.episodeNumber,
    episodeAirDate: episode.episodeAirDate.toString(),
    episodeTitle: episode.episodeTitle,
    episodeDescription: episode.episodeDescription,
    episodeImage: episode.episodeImageUrl,
  };
}

// async function doesEpisodeExist(episodeId: string): Promise<boolean>;
// async function doesEpisodeExist(episodeNumber: number, season: number): Promise<boolean>;

// async function doesEpisodeExist(episodeNumberOrId: string | number, season?: number): Promise<boolean> {
//   if (typeof episodeNumberOrId === 'string') {
//     if (validate(episodeNumberOrId) === false) {
//       throw errorFactory({ error: 'Invalid episodeId', statusCode: 400 });
//     }
//     const episode = await episodeRepository.getEpisodeByEpisodeId(episodeNumberOrId);
//     return !!episode;
//   } else {
//     if (!season) {
//       throw errorFactory({ error: 'Season is required when using episode number', statusCode: 400 });
//     }
//     const episode = await episodeRepository.getEpisodeBySeasonAndEpisodeNumber(season, episodeNumberOrId);
//     return !!episode;
//   }
// }

export default episodeService;
