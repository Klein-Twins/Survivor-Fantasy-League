import { models } from '../../config/db';
import { Episode } from '../../generated-api';
import episodeHelper from '../../helpers/season/episodeHelper';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { InternalServerError, NotFoundError } from '../../utils/errors/errors';

const episodeRepository = {
  getEpisode,
};

async function getEpisode(
  episodeId: EpisodeAttributes['episodeId']
): Promise<Episode>;
async function getEpisode(
  seasonId: SeasonsAttributes['seasonId'],
  episodeNumber: EpisodeAttributes['episodeNumber']
): Promise<Episode>;

async function getEpisode(
  episodeIdOrSeasonId:
    | EpisodeAttributes['episodeId']
    | SeasonsAttributes['seasonId'],
  episodeNumber?: EpisodeAttributes['episodeNumber']
): Promise<Episode> {
  //Case: function called with episodeId
  if (typeof episodeIdOrSeasonId === 'string' && episodeNumber === undefined) {
    const episodeAttributes: EpisodeAttributes | null =
      await models.Episode.findOne({
        where: {
          episodeId: episodeIdOrSeasonId,
        },
      });

    if (!episodeAttributes) {
      throw new NotFoundError('Episode not found');
    }

    return episodeHelper.buildEpisode(episodeAttributes);
  } else if (
    typeof episodeIdOrSeasonId === 'number' &&
    typeof episodeNumber === 'number'
  ) {
    const episodeAttributes: EpisodeAttributes | null =
      await models.Episode.findOne({
        where: {
          seasonId: episodeIdOrSeasonId,
          episodeNumber,
        },
      });
    if (!episodeAttributes) {
      throw new NotFoundError('Episode not found');
    }
    return episodeHelper.buildEpisode(episodeAttributes);
  } else {
    throw new InternalServerError(
      'Invalid arguments for episodeRepository.getEpisode'
    );
  }
}

export default episodeRepository;
