import { validate } from 'uuid';
import { EpisodeAttributes } from '../../models/season/SSN_EPISODES';
import errorFactory from '../../utils/errors/errorFactory';
import episodeRepository from '../../repositories/season/episodeRepository';

const episodeService = {
  doesEpisodeExist,
};

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

async function doesEpisodeExist(episodeId: string): Promise<boolean>;
async function doesEpisodeExist(episodeNumber: number, season: number): Promise<boolean>;

async function doesEpisodeExist(episodeNumberOrId: string | number, season?: number): Promise<boolean> {
  if (typeof episodeNumberOrId === 'string') {
    if (validate(episodeNumberOrId) === false) {
      throw errorFactory({ error: 'Invalid episodeId', statusCode: 400 });
    }
    const episode = await episodeRepository.getEpisodeByEpisodeId(episodeNumberOrId);
    return !!episode;
  } else {
    if (!season) {
      throw errorFactory({ error: 'Season is required when using episode number', statusCode: 400 });
    }
    const episode = await episodeRepository.getEpisodeBySeasonAndEpisodeNumber(season, episodeNumberOrId);
    return !!episode;
  }
}

export default episodeService;
