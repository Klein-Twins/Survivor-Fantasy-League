import { UUID } from 'crypto';
import {
  CreateSurvivorRequestBody,
  Survivor,
  SurvivorEliminationInfo,
} from '../../generated-api';
import { EpisodeAttributes } from '../../models/season/Episodes';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import survivorRepository from '../../repositories/season/survivorRepository';
import { NotImplementedError } from '../../utils/errors/errors';
import episodeService from './episodeService';
import seasonEliminationService from './seasonEliminationService';

const survivorService = {
  getSurvivorsAtStartOfEpisode,
  getSurvivorsBySeason,
  createSurvivor,
};

async function getSurvivorsAtStartOfEpisode(
  episodeId: EpisodeAttributes['episodeId']
): Promise<Survivor[]> {
  const episode = await episodeService.getEpisode('episodeId', episodeId);
  const survivorsOnSeason = await getSurvivorsBySeason(episode.seasonId);
  const seasonEliminationMap =
    await seasonEliminationService.getAllSurvivorsEliminationStatusAtStartOfEpisode(
      episode.seasonId,
      episodeId
    );

  const survivorPicks = survivorsOnSeason.map((survivor) => {
    const eliminationInfo = seasonEliminationMap[survivor.id as UUID];
    return {
      ...survivor,
      eliminationInfo,
    };
  });

  return survivorPicks;
}

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
    survivors.push(
      buildSurvivor(
        survivorData.survivor,
        survivorData,
        survivorEliminationInfo
      )
    );
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
  survivorEliminationInfo: SurvivorEliminationInfo
): Survivor {
  return {
    id: survivorAttributes.id,
    firstName: survivorAttributes.firstName,
    lastName: survivorAttributes.lastName,
    fromCity: survivorAttributes.fromCity,
    fromState: survivorAttributes.fromState,
    fromCountry: survivorAttributes.fromCountry,
    nickName: survivorAttributes.nickName,
    seasonId: survivorDetailAttributes.seasonId,
    age: survivorDetailAttributes.age,
    description: survivorDetailAttributes.description,
    job: survivorDetailAttributes.job,
    eliminationInfo: survivorEliminationInfo,
  };
}

export default survivorService;
