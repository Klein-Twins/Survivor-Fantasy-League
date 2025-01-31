import { validate } from 'uuid';
import { EpisodeAttributes } from '../../models/season/SSN_EPISODES';
import errorFactory from '../../utils/errors/errorFactory';
import episodeRepository from '../../repositories/season/episodeRepository';
import { Episode } from '../../generated-api';

const episodeService = {
  //doesEpisodeExist,
  validateEpisodeIsInSeason,
};

async function validateEpisodeIsInSeason(episodeId: string, seasonId: number): Promise<void> {
  const episode = await episodeRepository.getEpisodeByEpisodeId(episodeId);
  if (!episode) {
    throw errorFactory({ error: 'Episode does not exist', statusCode: 404 });
  }
  const seasonIdTiedToEpisode = episode.seasonId;
  if (seasonIdTiedToEpisode !== seasonId) {
    throw errorFactory({ error: 'Episode is not in season', statusCode: 400 });
  }
}

function getNextEpisode() {
  throw errorFactory({ error: 'Not implemented', statusCode: 501 });
}
function getCurrentEpisode() {
  throw errorFactory({ error: 'Not implemented', statusCode: 501 });
}
function getEpisodeBySeasonAndEpisodeNumber() {
  throw errorFactory({ error: 'Not implemented', statusCode: 501 });
}

function setCurrentEpisode() {
  throw errorFactory({ error: 'Not implemented', statusCode: 501 });
}

function hasEpisodeAired() {
  throw errorFactory({ error: 'Not implemented', statusCode: 501 });
}

async function getEpisode(episodeId: string): Promise<Episode> {
  if (validate(episodeId) === false) {
    throw errorFactory({ error: 'Invalid episodeId', statusCode: 400 });
  }
  const episode = await episodeRepository.getEpisodeByEpisodeId(episodeId);
  if (!episode) {
    throw errorFactory({ error: 'Episode does not exist', statusCode: 404 });
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
