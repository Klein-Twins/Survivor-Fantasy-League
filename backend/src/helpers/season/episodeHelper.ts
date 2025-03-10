import { Episode } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import episodeRepository from '../../repositories/seasons/episodeRepository';
import { BadRequestError, NotFoundError } from '../../utils/errors/errors';

const episodeHelper = {
  validateEpisodeNumber,
  validateEpisodeNumbers,
  buildEpisode,
  doesEpisodeExist,
  validateEpisodeIds,
};

async function validateEpisodeNumber(episodeNumber: number): Promise<void> {
  if (isNaN(episodeNumber)) {
    throw new BadRequestError('Invalid episode number');
  }
  if (episodeNumber < 1) {
    throw new BadRequestError('Invalid episode number');
  }
}

async function validateEpisodeIds(
  episodeIds: EpisodeAttributes['episodeId'][]
): Promise<void> {
  if (episodeIds.length === 0) {
    throw new BadRequestError('Missing episode id');
  }
  for (const episodeId of episodeIds) {
    await validateEpisodeId(episodeId);
  }
}

async function validateEpisodeId(
  episodeId: EpisodeAttributes['episodeId']
): Promise<void> {
  if (!episodeId) {
    throw new BadRequestError('Missing episode id');
  }
  const episode: Episode | null = await episodeRepository.getEpisodeByEpisodeId(
    episodeId
  );
  if (!episode) {
    throw new NotFoundError('Episode not found');
  }
}

async function validateEpisodeNumbers(episodeNumbers: number[]): Promise<void> {
  if (episodeNumbers.length === 0) {
    throw new BadRequestError('Missing episode number');
  }
  for (const episodeNumber of episodeNumbers) {
    await validateEpisodeNumber(episodeNumber);
  }
}

function buildEpisode(episodeAttributes: EpisodeAttributes): Episode {
  return {
    id: episodeAttributes.episodeId,
    episodeNumber: episodeAttributes.episodeNumber,
    seasonId: episodeAttributes.seasonId,
    episodeAirDate: episodeAttributes.episodeAirDate.toString(),
    episodeDescription: episodeAttributes.episodeDescription,
    episodeImage: episodeAttributes.episodeImageUrl,
    episodeTitle: episodeAttributes.episodeTitle,
  };
}

async function doesEpisodeExist(
  seasonId: EpisodeAttributes['seasonId'],
  episodeNumber: EpisodeAttributes['episodeNumber']
): Promise<boolean> {
  const episode: Episode | null =
    await episodeRepository.getEpisodeBySeasonAndEpisodeNumber(
      seasonId,
      episodeNumber
    );
  return episode !== null;
}

export default episodeHelper;
