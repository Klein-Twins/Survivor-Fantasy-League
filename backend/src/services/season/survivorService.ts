import { UUID } from 'crypto';
import {
  CreateSurvivorRequestBody,
  // EliminationStatus,
  Survivor,
  SurvivorBasic,
  SurvivorElimination,
} from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import survivorRepository from '../../repositories/season/survivorRepository';
import { NotFoundError, NotImplementedError } from '../../utils/errors/errors';
// import seasonEliminationService from './seasonEliminationService';
import { models } from '../../config/db';
import episodeService from './episodeService';

const survivorService = {
  getSurvivorsAtStartOfEpisode,
  getSurvivorsBySeason,
  createSurvivor,
  buildSurvivor,
  buildBasicSurvivor,
  getSurvivorById,
  getBasicSurvivorDetails,
};

async function getSurvivorInSeason(
  survivorId: SurvivorDetailsOnSeasonAttributes['id'],
  seasonId: SeasonsAttributes['seasonId']
): Promise<Survivor> {
  const survivorData = await survivorRepository.getSurvivor(
    survivorId,
    seasonId
  );

  if (!survivorData) {
    throw new NotFoundError('No Survivor found for id: ' + survivorId);
  }

  return buildSurvivor(survivorData.survivor, survivorData);
}

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
    // survivor.eliminationInfo = survivorsWithStatus;
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

  // const survivorEliminationInfo =
  //   await seasonEliminationService.getSurvivorEliminationInfo(
  //     survivorId,
  //     seasonId
  //   );

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
    // const survivorEliminationInfo =
    //   await seasonEliminationService.getSurvivorEliminationInfo(
    //     survivorData.survivor.id,
    //     seasonId
    //   );
    survivors.push(buildSurvivor(survivorData.survivor, survivorData));
  }

  return survivors;
}

async function createSurvivor(
  reqData: CreateSurvivorRequestBody
): Promise<Survivor> {
  throw new NotImplementedError('createSurvivor');
}

function buildBasicSurvivor(
  survivorAttributes: SurvivorsAttributes
): SurvivorBasic {
  return {
    id: survivorAttributes.id,
    firstName: survivorAttributes.firstName,
    lastName: survivorAttributes.lastName,
    name: survivorAttributes.firstName + ' ' + survivorAttributes.lastName,
  };
}

function buildSurvivor(
  survivorAttributes: SurvivorsAttributes,
  survivorDetailAttributes: SurvivorDetailsOnSeasonAttributes
  // survivorStatus?: EliminationStatus
): Survivor {
  const basicSurvivor: SurvivorBasic = buildBasicSurvivor(survivorAttributes);

  // if (!survivorStatus) {
  //   throw new NotFoundError(
  //     'No Survivor Status found for id: ' + survivorAttributes.id
  //   );
  // }

  return {
    ...basicSurvivor,
    fromCity: survivorAttributes.fromCity,
    fromState: survivorAttributes.fromState,
    fromCountry: survivorAttributes.fromCountry,
    nickName: survivorAttributes.nickName,
    seasonId: survivorDetailAttributes.seasonId,
    age: survivorDetailAttributes.age,
    description: survivorDetailAttributes.description,
    job: survivorDetailAttributes.job,
    finishStatus: {},
    // eliminationInfo: survivorStatus,
  };
}

export default survivorService;
