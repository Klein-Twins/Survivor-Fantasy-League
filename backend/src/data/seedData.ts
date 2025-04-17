import { NODE_ENV } from '../config/config';
import { models } from '../config/db';
import logger from '../config/logger';
import { EpisodeType } from '../generated-api';
import { SeasonsAttributes } from '../models/season/Seasons';
import tribeMemberService from '../services/season/tribeMemberService';
import accountProcessor from './dev/processing/account/accountProcessor';
import leagueProcessor from './dev/processing/lge/leagueProcessor';
import seedDevData from './dev/SeedDevData';
import { picksData } from './foundation/data/surveysAndPicks/pickData/picksData';
import seasonProcessor from './foundation/processing/ssn/season';
import pickProcessor from './foundation/processing/sur/pick';
import surveyProcessor from './foundation/processing/sur/survey';
import seedFoundationData from './foundation/SeedFoundationData';

const seedData = async () => {
  await accountProcessor.processTestAccounts();

  await surveyProcessor.processSurveyDefinitions();

  await pickProcessor.processPicks(picksData);
  await seasonProcessor.processSeasons();
};

export default seedData;

async function devTestTribeMemberData(seasonId: SeasonsAttributes['seasonId']) {
  const tribes = await models.Tribe.findAll({
    where: {
      seasonId: seasonId,
    },
  });

  const episodes = await models.Episode.findAll({
    where: {
      seasonId: seasonId,
    },
  });

  for (const episode of episodes) {
    logger.debug(`Tribe and its members on episode ${episode.number}`);
    logger.debug(`Is Episode TribeSwap?: ${episode.isTribeSwitch}`);
    logger.debug(
      `Is Episode Merge episode?: ${episode.type === EpisodeType.TRIBELESS}`
    );
    for (const tribe of tribes) {
      const tribeMembersThroughoutEpisode =
        await tribeMemberService.getTribeMemberStatusesOnEpisode(
          tribe.id,
          episode.id
        );

      logger.debug(`Tribe: ${tribe.name}`);
      logger.debug(`Tribe Members at the beginning of episode:`);
      for (const tribeMember of tribeMembersThroughoutEpisode.tribeMembersEpisodeStart) {
        logger.debug(
          `Survivor: ${tribeMember.firstName} ${tribeMember.lastName}`
        );
      }

      logger.debug(`Tribe Members just before elimination:`);
      for (const tribeMember of tribeMembersThroughoutEpisode.tribeMembersBeforeElimination) {
        logger.debug(
          `Survivor: ${tribeMember.firstName} ${tribeMember.lastName}`
        );
      }

      logger.debug(`Tribe Members at the end of episode:`);
      for (const tribeMember of tribeMembersThroughoutEpisode.tribeMembersAtEndOfEpisode) {
        logger.debug(
          `Survivor: ${tribeMember.firstName} ${tribeMember.lastName}`
        );
      }
    }
  }
}
