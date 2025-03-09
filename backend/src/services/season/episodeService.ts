import { Transaction } from 'sequelize';
import { Episode } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import episodeRepository from '../../repositories/seasons/episodeRepository';
import { BadRequestError } from '../../utils/errors/errors';
import { sequelize } from '../../config/db';
import episodeHelper from '../../helpers/season/episodeHelper';

const episodeService = {
  getEpisodes,
  getEpisodeBySeasonAndEpisodeNumber,
  createEpisodesForNewSeason,
  getEpisodesBySeasonId,
};

async function getEpisodeBySeasonAndEpisodeNumber(
  seasonId: SeasonsAttributes['seasonId'],
  episodeNumber: EpisodeAttributes['episodeNumber']
): Promise<Episode> {
  return await episodeRepository.getEpisodeBySeasonAndEpisodeNumber(
    seasonId,
    episodeNumber
  );
}

async function getEpisodes(
  episodeIds: EpisodeAttributes['episodeId'][]
): Promise<Episode[]>;
async function getEpisodes(
  seasonId: SeasonsAttributes['seasonId'],
  episodeNumbers: EpisodeAttributes['episodeNumber'][]
): Promise<Episode[]>;

async function getEpisodes(
  episodeIdsOrSeasonId:
    | EpisodeAttributes['episodeId']
    | EpisodeAttributes['episodeId'][]
    | SeasonsAttributes['seasonId'],
  episodeNumbers?: EpisodeAttributes['episodeNumber'][]
): Promise<Episode[]> {
  //Case: function called with episodeIds[]
  if (Array.isArray(episodeIdsOrSeasonId) && episodeNumbers === undefined) {
    return Promise.all(
      episodeIdsOrSeasonId.map(async (episodeId) => {
        return episodeRepository.getEpisodeByEpisodeId(episodeId);
      })
    );
    //Case: function called with a single episodeId
  } else if (
    typeof episodeIdsOrSeasonId === 'string' &&
    episodeNumbers === undefined
  ) {
    return [
      await episodeRepository.getEpisodeByEpisodeId(episodeIdsOrSeasonId),
    ];
  } else if (
    typeof episodeIdsOrSeasonId === 'number' &&
    Array.isArray(episodeNumbers)
  ) {
    return Promise.all(
      episodeNumbers.map(async (episodeNumber) => {
        return episodeRepository.getEpisodeBySeasonAndEpisodeNumber(
          episodeIdsOrSeasonId,
          episodeNumber
        );
      })
    );
  } else {
    throw new Error('Invalid arguments for episodeService.getEpisodes');
  }
}

async function getEpisodesBySeasonId(
  seasonId: SeasonsAttributes['seasonId']
): Promise<Episode[]> {
  const episodesAttributes: EpisodeAttributes[] =
    await episodeRepository.getEpisodesBySeasonId(seasonId);
  const episode: Episode[] = [];
  for (let episodeAttributes of episodesAttributes) {
    episode.push(episodeHelper.buildEpisode(episodeAttributes));
  }
  return episode;
}

async function createEpisodesForNewSeason(
  seasonid: SeasonsAttributes['seasonId'],
  seasonPremierDate: EpisodeAttributes['episodeAirDate'],
  seasonFinaleDate: EpisodeAttributes['episodeAirDate'],
  transaction?: Transaction
): Promise<Episode[]> {
  if (seasonPremierDate > seasonFinaleDate) {
    throw new BadRequestError('Premier date must be before finale date');
  }
  if (seasonPremierDate.getDay() !== seasonFinaleDate.getDay()) {
    throw new BadRequestError(
      'Premier and finale date must be on the same day of the week.'
    );
  }

  const dates = [];
  let currentDate = new Date(seasonPremierDate);
  while (currentDate <= seasonFinaleDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }

  let t = transaction;
  if (!transaction) {
    t = await sequelize.transaction();
  }
  try {
    let episodes: Episode[] = [];
    for (let i = 1; i <= dates.length; i++) {
      const episodeAttributes: EpisodeAttributes =
        await episodeRepository.createEpisode(seasonid, i, dates[i - 1], t);
      episodes = [...episodes, episodeHelper.buildEpisode(episodeAttributes)];
    }
    if (!transaction && t) {
      await t.commit();
    }
    return episodes;
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

// async function getEpisodes(
//   episodeIds: EpisodeAttributes['episodeId'][]
// ): Promise<Episode[]> {
//   return Promise.all(
//     episodeIds.map(async (episodeId) => {
//       return episodeRepository.getEpisode(episodeId);
//     })
//   );
// }

// async function getEpisodes(
//   seasonId: SeasonsAttributes['seasonId'],
//   episodeNumbers:
//     | EpisodeAttributes['episodeNumber'][]
//     | EpisodeAttributes['episodeNumber']
// ): Promise<Episode[]> {
//   if (Array.isArray(episodeNumbers)) {
//     return Promise.all(
//       episodeNumbers.map(async (episodeNumber) => {
//         return episodeRepository.getEpisode(seasonId, episodeNumber);
//       })
//     );
//   } else {
//     return [await episodeRepository.getEpisode(seasonId, episodeNumbers)];
//   }
// }

export default episodeService;
