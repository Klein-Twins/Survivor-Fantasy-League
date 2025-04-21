import {
  Episode,
  EpisodeEvents,
  EpisodeInfo,
  TribeMembersState,
} from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { TribeAttributes } from '../../models/season/Tribes';
import episodeRepository from '../../repositoriesBackup/season/episode/episodeRepository';
import { InternalServerError, NotFoundError } from '../../utils/errors/errors';
import tribeMemberService from './tribeMemberService';
import tribeService from './tribeService';

const episodeService = {
  getEpisodesBySeasonId,
  getEpisode,
  getAllEpisodesInSeason,
  getPremierEpisodeInSeason,
};

async function getPremierEpisodeInSeason(
  seasonId: EpisodeAttributes['seasonId']
): Promise<Episode> {
  const episodeAttributes: EpisodeAttributes | null =
    await episodeRepository.getPremierEpisodeInSeason(seasonId);
  if (!episodeAttributes) {
    throw new NotFoundError('Premier Episode not found for season');
  }

  const tribesMap = await tribeService.getTribesOnEpisode1(
    episodeAttributes!.id
  );

  return buildEpisode(episodeAttributes!, tribesMap);
}

async function getAllEpisodesInSeason(
  seasonId: EpisodeAttributes['seasonId']
): Promise<Map<EpisodeAttributes['id'], Episode>> {
  const episodesAttributes: EpisodeAttributes[] =
    await episodeRepository.getAllEpisodesInSeason(seasonId);

  const episodeMap = new Map<EpisodeAttributes['id'], Episode>();
  for (const episodeAttributes of episodesAttributes) {
    const tribesMap = await tribeService.getTribesOnEpisode1(
      episodeAttributes.id
    );
    episodeMap.set(
      episodeAttributes.id,
      buildEpisode(episodeAttributes, tribesMap)
    );
  }
  return episodeMap;
}

async function getEpisodesBySeasonId(
  seasonId: EpisodeAttributes['seasonId']
): Promise<Episode[]> {
  const episodesAttributes: EpisodeAttributes[] =
    await episodeRepository.getEpisodesBySeasonId(seasonId);
  const episodes: Episode[] = [];
  for (const episodeAttributes of episodesAttributes) {
    const tribesMap = await tribeService.getTribesOnEpisode1(
      episodeAttributes.id
    );
    episodes.push(buildEpisode(episodeAttributes, tribesMap));
  }
  return episodes;
}

async function getEpisode(
  field: 'episodeId',
  value: EpisodeAttributes['id']
): Promise<Episode>;
async function getEpisode(
  field: 'seasonIdAndEpisodeNumber',
  value: {
    seasonId: EpisodeAttributes['seasonId'];
    episodeNumber: EpisodeAttributes['number'];
  }
): Promise<Episode>;
async function getEpisode(
  field: 'seasonIdAndEpisodeId',
  value: {
    seasonId: EpisodeAttributes['seasonId'];
    episodeId: EpisodeAttributes['id'];
  }
): Promise<Episode>;

async function getEpisode(
  field: 'episodeId' | 'seasonIdAndEpisodeNumber' | 'seasonIdAndEpisodeId',
  value:
    | EpisodeAttributes['id']
    | {
        seasonId: EpisodeAttributes['seasonId'];
        episodeNumber: EpisodeAttributes['number'];
      }
    | {
        seasonId: EpisodeAttributes['seasonId'];
        episodeId: EpisodeAttributes['id'];
      }
): Promise<Episode> {
  let episodeAttributes: EpisodeAttributes | null = null;

  if (field === 'seasonIdAndEpisodeNumber') {
    const { seasonId, episodeNumber } = value as {
      seasonId: EpisodeAttributes['seasonId'];
      episodeNumber: EpisodeAttributes['number'];
    };
    episodeRepository.getEpisode(field, { seasonId, episodeNumber });
  } else if (field === 'seasonIdAndEpisodeId') {
    const { seasonId, episodeId } = value as {
      seasonId: EpisodeAttributes['seasonId'];
      episodeId: EpisodeAttributes['id'];
    };
    episodeAttributes = await episodeRepository.getEpisode(field, {
      seasonId,
      episodeId,
    });
  } else if (field === 'episodeId') {
    const episodeId = value as EpisodeAttributes['id'];
    episodeAttributes = await episodeRepository.getEpisode(field, episodeId);
  } else {
    throw new InternalServerError('Invalid field to get episode');
  }

  const tribesMap = await tribeService.getTribesOnEpisode1(
    episodeAttributes!.id
  );

  return buildEpisode(episodeAttributes!, tribesMap);
}

function buildEpisode(
  episodeAttributes: EpisodeAttributes,
  tribesMap: Map<TribeAttributes['id'], TribeMembersState>
): Episode {
  const tribesObject: { [key: string]: TribeMembersState } =
    Object.fromEntries(tribesMap);

  const episodeEvents = buildEpisodeEvents(episodeAttributes, tribesMap);

  const episodeInfo = buildEpisodeInfo(episodeAttributes);

  return {
    ...episodeEvents,
    ...episodeInfo,
  };
}

function buildEpisodeEvents(
  episodeAttributes: EpisodeAttributes,
  tribesMap: Map<TribeAttributes['id'], TribeMembersState>
): EpisodeEvents {
  const tribesObject: { [key: string]: TribeMembersState } =
    Object.fromEntries(tribesMap);

  return {
    isTribeSwitch: episodeAttributes.isTribeSwitch || false,
    tribesState: tribesObject,
  };
}

function buildEpisodeInfo(episodeAttributes: EpisodeAttributes): EpisodeInfo {
  const hasAired = new Date(episodeAttributes.airDate) < new Date();
  return {
    id: episodeAttributes.id,
    number: episodeAttributes.number,
    seasonId: episodeAttributes.seasonId,
    airDate: episodeAttributes.airDate.toString(),
    description: episodeAttributes.description,
    title: episodeAttributes.title,
    episodeType: episodeAttributes.type,
    hasAired,
  };
}

export default episodeService;
