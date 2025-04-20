import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { Episode } from '../../../../domain/episode';
import { Season } from '../../../../domain/season';
import { SeasonSurvivor } from '../../../../domain/seasonSurvivor';
import { Survivor } from '../../../../domain/survivor';
import { Tribe } from '../../../../domain/tribe';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { SeasonsAttributes } from '../../../../models/season/Seasons';
import {
  TribeAttributes,
  TribeCreationAttributes,
} from '../../../../models/season/Tribes';
import { SurvivorDetailsOnSeasonAttributes } from '../../../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../../../models/survivors/Survivors';
import leagueProcessor from '../../../dev/processing/lge/leagueProcessor';
// import season47, { Season47Tribes } from '../../data/ssn/47/season47';
import { season48, Season48Tribes } from '../../data/ssn/48/season48';
import { EpisodeInfo, SeasonData } from '../../data/ssn/dataTypes';
import survivorsData from '../../data/survivors/survivorsData';

const seasonProcessor = {
  processSeasons,
  processSeason,
};

async function processSeasons() {
  const seasons: Array<SeasonData<Season48Tribes>> = [
    season48,
    // season47,
  ];
  await processSeason(seasons[0]);
}

async function processSeason<T extends string | number | symbol>(
  seasonData: SeasonData<T>
) {
  logger.debug(`Beginning to process season: ${seasonData.seasonId}`);

  const season = await Season.fromAttributes({
    seasonId: seasonData.seasonId,
    theme: seasonData.theme,
    location: seasonData.location,
    name: seasonData.name,
    startDate: seasonData.startDate,
    endDate: seasonData.endDate,
    isActive: seasonData.isActive,
  });

  logger.debug('Beginning to process survivors');
  const allSurvivors = survivorsData;
  const survivorsOnSeason = allSurvivors.filter(
    (survivor) => !!survivor.seasonDetails.get(seasonData.seasonId)
  );

  logger.debug(
    `Found ${survivorsOnSeason.length} survivors for season ${seasonData.seasonId}`
  );

  for (const survivor of survivorsOnSeason) {
    logger.debug(
      `Processing survivor: ${survivor.firstName} ${survivor.lastName}`
    );

    const survivorAttributes: SurvivorDetailsOnSeasonAttributes &
      SurvivorsAttributes = {
      id: survivor.id,
      firstName: survivor.firstName,
      lastName: survivor.lastName,
      seasonId: seasonData.seasonId,
      nickName: survivor.nickName,
      fromCity: survivor.fromCity,
      fromState: survivor.fromState,
      fromCountry: survivor.fromCountry,
      age: survivor.seasonDetails.get(seasonData.seasonId)?.age || 0,
      description:
        survivor.seasonDetails.get(seasonData.seasonId)?.description || '',
      job: survivor.seasonDetails.get(seasonData.seasonId)?.job || '',
    };

    const seasonSurvivorObject =
      SeasonSurvivor.fromAttributes(survivorAttributes);

    season.addSurvivor(seasonSurvivorObject);
  }

  await season.save();

  logger.debug('Finished processing survivors');

  // logger.debug('Beginning to process tribes');
  // for (const tribeData of seasonData.tribes.values()) {
  //   logger.debug(`Processing tribe: ${tribeData.name}`);
  //   const startingSurvivors = tribeData.startingSurvivors.map((survivorId) => {
  //     return season.getSurvivorById(survivorId);
  //   });

  //   const tribeCreationData: Omit<
  //     TribeAttributes,
  //     'episodeIdStart' | 'episodeIdEnd'
  //   > = {
  //     seasonId: seasonData.seasonId,
  //     id: tribeData.id,
  //     name: tribeData.name,
  //     hexColor: tribeData.hexColor,
  //     color: tribeData.color,
  //     mergeTribe: tribeData.mergeTribe,
  //   };

  //   const tribeObject = Tribe.fromAttributes(tribeCreationData);
  //   tribeObject.addStartingSurvivors(startingSurvivors);

  //   season.addTribe(tribeObject);
  // }

  const episodesData = seasonData.episodes;

  for (const [number, episodeStuff] of episodesData) {
    const episodeInfo = episodeStuff.episodeInfo;
    const episodeEvents = episodeStuff.episodeEvents;

    const episodeCreationData: EpisodeAttributes = {
      seasonId: seasonData.seasonId,
      id: episodeInfo.id,
      number: episodeInfo.number,
      title: episodeInfo.title,
      airDate: episodeInfo.airDate,
      description: episodeInfo.description,
      type: episodeInfo.type,
    };

    const episodeObject = Episode.fromAttributes(episodeCreationData);

    season.addEpisode(episodeObject);

    // if (episodeEvents?.tribeStart) {
    //   for (const tribeId of episodeEvents.tribeStart) {
    //     season.getTribeById(tribeId).start(episodeInfo.id);
    //   }
    // }

    if (episodeEvents?.tribeStart) {
      for (const tribeData of episodeEvents.tribeStart) {
        const tribeAttributes: Omit<
          TribeAttributes,
          'episodeIdStart' | 'episodeIdEnd'
        > = {
          seasonId: seasonData.seasonId,
          id: tribeData.id,
          name: tribeData.name,
          hexColor: tribeData.hexColor,
          color: tribeData.color,
          mergeTribe: false,
        };

        const startingSurvivors = tribeData.startingSurvivors.map(
          (survivorId) => {
            return season.getSurvivorById(survivorId);
          }
        );

        const tribe = Tribe.fromAttributes(tribeAttributes);
        season.addTribe(tribe);
        tribe.addStartingSurvivors(startingSurvivors);
        tribe.start(episodeObject);
      }
    }

    if (episodeEvents?.eliminatedSurvivors) {
      for (const eliminatedSurvivorData of episodeEvents.eliminatedSurvivors) {
        const survivor = season.getSurvivorById(
          eliminatedSurvivorData.survivorId
        );
        const episode = season.getEpisodeById(episodeInfo.id);

        survivor.eliminate(
          episodeObject,
          eliminatedSurvivorData.placement,
          eliminatedSurvivorData.notes,
          eliminatedSurvivorData.day,
          eliminatedSurvivorData.seq,
          eliminatedSurvivorData.juryPlacement,
          eliminatedSurvivorData.type
        );
      }
    }
  }

  await season.save();

  const season1DTO = season.toDTO();

  const season2 = await Season.findById(seasonData.seasonId);
  const season2DTO = season2.toDTO();
  console.log();
}

// async function processSeason<T extends string | number | symbol>(
//   seasonData: SeasonData<T>
// ) {
//   logger.debug(`Processing season: ${seasonData.seasonId}`);
//   await seedSeasonTable(seasonData);

//   //Seed survivors
//   await survivorProcessor.processSurvivors(seasonData.seasonId);

//   await leagueProcessor.processLeagues(seasonData.seasonId);

//   //seed episode infos
//   const episodeInfos: EpisodeInfo[] = [];
//   for (const episode of seasonData.episodes) {
//     episodeInfos.push(episode[1].episodeInfo);
//   }
//   await episodeProcessor.processAllEpisodesInfo(
//     episodeInfos,
//     seasonData.seasonId
//   );

//   for (const episodeInfo of episodeInfos) {
//     await surveyProcessor.processEpisodeSurvey(episodeInfo.id);
//   }

//   //Seed starting tribes
//   const startingTribes: StartingTribe[] = [];
//   for (const tribe of seasonData.tribes) {
//     startingTribes.push(tribe[1]);
//   }
//   await tribeProcessor.processStartingTribes(
//     startingTribes,
//     seasonData.seasonId
//   );

//   await episodeProcessor.processAllEpisodeEvents(seasonData.episodes);
// }

async function seedSeasonTable(seasonData: SeasonsAttributes) {
  logger.debug(
    `${models.Seasons.tableName}: Starting data processing for ${seasonData.seasonId}`
  );

  // Delete existing records for the season
  const numDeleted = await models.Seasons.destroy({
    where: { seasonId: seasonData.seasonId },
  });
  if (numDeleted !== 0) {
    logger.debug(
      `${models.Seasons.tableName}: Deleted ${numDeleted} records for season: ${seasonData.seasonId}`
    );
  }

  // Create a new record for the season
  logger.debug(
    `${models.Seasons.tableName}: Creating record for season: ${seasonData.seasonId}`
  );
  await models.Seasons.create({
    seasonId: seasonData.seasonId,
    theme: seasonData.theme,
    location: seasonData.location,
    name: seasonData.name,
    startDate: seasonData.startDate,
    endDate: seasonData.endDate,
    isActive: seasonData.isActive,
  });
  logger.debug(
    `${models.Seasons.tableName}: Created record for season: ${seasonData.seasonId}`
  );
}

export default seasonProcessor;
