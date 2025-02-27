import { Episode } from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import episodeRepository from '../../repositories/seasons/episodeRepository';

const episodeService = { getEpisodes };
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
        return episodeRepository.getEpisode(episodeId);
      })
    );
    //Case: function called with a single episodeId
  } else if (
    typeof episodeIdsOrSeasonId === 'string' &&
    episodeNumbers === undefined
  ) {
    return [await episodeRepository.getEpisode(episodeIdsOrSeasonId)];
  } else if (
    typeof episodeIdsOrSeasonId === 'number' &&
    Array.isArray(episodeNumbers)
  ) {
    return Promise.all(
      episodeNumbers.map(async (episodeNumber) => {
        return episodeRepository.getEpisode(
          episodeIdsOrSeasonId,
          episodeNumber
        );
      })
    );
  } else {
    throw new Error('Invalid arguments for episodeService.getEpisodes');
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
