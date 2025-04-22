import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { Challenge, Episode, EpisodeInfo } from '../../data/ssn/dataTypes';

const challengeProcessor = {
  processChallenges,
};

async function processChallenges(episode: Episode) {
  await models.Challenges.destroy({
    where: {
      episodeId: episode.episodeInfo.id,
    },
  });

  logger.debug(
    `Processing challenges for episode: ${episode.episodeInfo.number}`
  );
  if (episode.episodeEvents?.challenges) {
    for (const challenge of episode.episodeEvents.challenges) {
      await processChallenge(episode.episodeInfo, challenge);
    }
  }
  logger.debug(
    `Processed challenges for episode: ${episode.episodeInfo.number}`
  );
}

async function processChallenge(
  episodeInfo: EpisodeInfo,
  challenge: Challenge
) {
  logger.debug(
    `Processing challenge: ${challenge.rank} (${challenge.type}) for episode: ${episodeInfo.number}`
  );

  const createdChallenge = await models.Challenges.create({
    id: challenge.id,
    episodeId: episodeInfo.id,
    type: challenge.type,
    description: challenge.description,
    rank: challenge.rank,
    notes: challenge.notes,
  });

  const challengeWinners = challenge.results.forEach(async (result) => {
    let winnerName = null;
    if (result.winnerSurvivorId) {
      winnerName = await models.Survivors.findOne({
        where: {
          id: result.winnerSurvivorId,
        },
      }).then((survivor) => survivor?.firstName);
    } else if (result.winnerTribeId) {
      winnerName = await models.Tribe.findOne({
        where: {
          id: result.winnerTribeId,
        },
      }).then((tribe) => tribe?.name);
    } else {
      logger.error(`Challenge winner does not have a tribe or survivor id`);
      return;
    }

    logger.debug(
      `Processing challenge ${result.rank} winner: ${result.winnerType} | ${
        result.winnerSurvivorId ? result.winnerSurvivorId : result.winnerTribeId
      } for episode: ${episodeInfo.number}`
    );

    await models.ChallengeWinners.create({
      challengeId: createdChallenge.id,
      winnerSurvivorId: result.winnerSurvivorId,
      winnerTribeId: result.winnerTribeId,
      rank: result.rank,
      reward: result.reward,
      winnerType: result.winnerType,
      winnerNotes: result.winnerNotes,
    });
  });
}

export default challengeProcessor;
