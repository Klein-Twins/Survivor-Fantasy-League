import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { SeasonsAttributes } from '../../../../models/season/Seasons';
import { StartingTribe, Tribes } from '../../data/ssn/dataTypes';
import survivorProcessor from './survivor';

const tribeProcessor = {
  processStartingTribes,
};

async function processTribes<T extends string | number | symbol>(
  seasonId: SeasonsAttributes['seasonId'],
  tribes: Tribes<T>
) {
  logger.debug(`Processing tribes for season ${seasonId}`);
}

async function processStartingTribes(
  tribes: StartingTribe[],
  seasonId: SeasonsAttributes['seasonId']
) {
  logger.debug(`Processing starting tribes for season ${seasonId}`);

  for (const tribe of tribes) {
    await processStartingTribe(tribe, seasonId);
  }

  logger.debug(`Processed starting tribes for season ${seasonId}`);
}

async function processStartingTribe(
  tribe: StartingTribe,
  seasonId: SeasonsAttributes['seasonId']
) {
  logger.debug(
    `Processing starting tribe ${tribe.name} for season ${seasonId}`
  );

  await seedTribeTable(tribe, seasonId);
  await survivorProcessor.processTribeMembersForStartingTribe(tribe, seasonId);

  logger.debug(`Processed starting tribe ${tribe.name} for season ${seasonId}`);
}

async function seedTribeTable(
  tribe: StartingTribe,
  seasonId: SeasonsAttributes['seasonId']
) {
  logger.debug(
    `${models.Tribe.tableName}: Starting data processing for ${tribe.id}`
  );

  const numDeleted = await models.Tribe.destroy({
    where: { id: tribe.id },
  });
  if (numDeleted !== 0) {
    logger.debug(
      `${models.Tribe.tableName}: Deleted ${numDeleted} records for tribe: ${tribe.id}`
    );
  }

  logger.debug(
    `${models.Tribe.tableName}: Creating record for tribe: ${tribe.id}`
  );
  const createdTribe = await models.Tribe.create({
    id: tribe.id,
    seasonId: seasonId,
    name: tribe.name,
    color: tribe.color,
    hexColor: tribe.hexColor,
    mergeTribe: tribe.mergeTribe,
    episodeIdStart: tribe.episodeIdStart,
    episodeIdEnd: null,
  });
  logger.debug(
    `${models.Tribe.tableName}: Created record for tribe: ${tribe.id}`
  );
}

export default tribeProcessor;
