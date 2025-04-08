import { UUID } from 'crypto';
import {
  CreateSurvivorRequestBody,
  Survivor,
  SurvivorBasic,
  SurvivorStatus,
} from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import survivorRepository from '../../repositories/season/survivorRepository';
import { NotFoundError, NotImplementedError } from '../../utils/errors/errors';
import episodeService from './episodeService';
import seasonEliminationService from './seasonEliminationService';
import { models } from '../../config/db';

const survivorService = {
  getSurvivorsAtStartOfEpisode,
  getSurvivorsBySeason,
  createSurvivor,
  getSurvivorById,
  getBasicSurvivorDetails,
};

async function getSurvivorsAtStartOfEpisode(
  episodeId: EpisodeAttributes['id']
): Promise<Survivor[]> {
  const episode = await episodeService.getEpisode('episodeId', episodeId);
  const seasonId = episode.seasonId;
  const survivorsOnSeason = await getSurvivorsBySeason(seasonId);
  for (const survivor of survivorsOnSeason) {
    const survivorsWithStatus =
      await survivorRepository.getSurvivorStatusAtEpisode(
        survivor.id as UUID,
        episodeId
      );
    survivor.survivorStatus = survivorsWithStatus;
  }

  return survivorsOnSeason;
}

async function getBasicSurvivorDetails(
  survivorId: SurvivorsAttributes['id']
): Promise<SurvivorBasic> {
  const survivorAttributes = await models.Survivors.findOne({
    where: {
      id: survivorId,
    },
  });
  if (!survivorAttributes) {
    throw new NotFoundError('No Survivor found for id: ' + survivorId);
  }
  const survivorInfo: SurvivorBasic = {
    id: survivorId,
    firstName: survivorAttributes.firstName,
    lastName: survivorAttributes.lastName,
    name: survivorAttributes.firstName + ' ' + survivorAttributes.lastName,
  };
  return survivorInfo;
}

async function getSurvivorById(
  survivorId: SurvivorDetailsOnSeasonAttributes['id'],
  seasonId: SeasonsAttributes['seasonId']
): Promise<Survivor> {
  const survivorData = await survivorRepository.getSurvivor(
    survivorId,
    seasonId
  );

  if (!survivorData) {
    throw new Error(`Survivor with ID ${survivorId} not found`);
  }

  const survivorEliminationInfo =
    await seasonEliminationService.getSurvivorEliminationInfo(
      survivorId,
      seasonId
    );

  return buildSurvivor(survivorData.survivor, survivorData);
}

// async function getSurvivorsAtStartOfEpisode(
//   episodeId: EpisodeAttributes['id']
// ): Promise<Survivor[]> {
//   const episode = await episodeService.getEpisode('episodeId', episodeId);
//   const survivorsOnSeason = await getSurvivorsBySeason(episode.seasonId);
//   const seasonEliminationMap =
//     await seasonEliminationService.getAllSurvivorsEliminationStatusAtStartOfEpisode(
//       episode.seasonId,
//       episodeId
//     );

//   const survivorPicks = survivorsOnSeason.map((survivor) => {
//     const eliminationInfo = seasonEliminationMap[survivor.id as UUID];
//     return {
//       ...survivor,
//       eliminationInfo,
//     };
//   });

//   return survivorPicks;
// }

// async function getSurvivorsAtStartOfEpisode(
//   episodeId: EpisodeAttributes['id']
// ): Promise<Survivor[]> {
//   const episode = await episodeService.getEpisode('episodeId', episodeId);

//   const seasonId = episode.seasonId;

//   const survivorsWithStatusAtStartOfEpisode =
//     await survivorRepository.getSurvivorWithStatusAtStartOfEpisode(
//       episodeId,
//       seasonId
//     );

//   return survivorsWithStatusAtStartOfEpisode;
// }

async function getSurvivorsBySeason(
  seasonId: SeasonsAttributes['seasonId']
): Promise<Survivor[]> {
  const survivorsOnSeasonData = await survivorRepository.getSurvivorsBySeasonId(
    seasonId
  );

  const survivors: Survivor[] = [];

  for (const survivorData of survivorsOnSeasonData) {
    const survivorEliminationInfo =
      await seasonEliminationService.getSurvivorEliminationInfo(
        survivorData.survivor.id,
        seasonId
      );
    survivors.push(buildSurvivor(survivorData.survivor, survivorData));
  }

  return survivors;
}

async function createSurvivor(
  reqData: CreateSurvivorRequestBody
): Promise<Survivor> {
  throw new NotImplementedError('createSurvivor');
}

function buildSurvivor(
  survivorAttributes: SurvivorsAttributes,
  survivorDetailAttributes: SurvivorDetailsOnSeasonAttributes,
  survivorStatus?: SurvivorStatus
): Survivor {
  return {
    id: survivorAttributes.id,
    firstName: survivorAttributes.firstName,
    lastName: survivorAttributes.lastName,
    name: survivorAttributes.firstName + ' ' + survivorAttributes.lastName,
    fromCity: survivorAttributes.fromCity,
    fromState: survivorAttributes.fromState,
    fromCountry: survivorAttributes.fromCountry,
    nickName: survivorAttributes.nickName,
    seasonId: survivorDetailAttributes.seasonId,
    age: survivorDetailAttributes.age,
    description: survivorDetailAttributes.description,
    job: survivorDetailAttributes.job,
  };
}

export default survivorService;
