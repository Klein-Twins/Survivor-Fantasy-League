import { Op } from 'sequelize';
import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { EpisodeType } from '../../../../generated-api';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { SeasonsAttributes } from '../../../../models/season/Seasons';
import { TribeMemberAttributes } from '../../../../models/season/TribeMembers';
import { TribeAttributes } from '../../../../models/season/Tribes';
import { SurvivorDetailsOnSeasonAttributes } from '../../../../models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../../../models/survivors/Survivors';
import {
  EliminatedSurvivor,
  EliminatedSurvivors,
  StartingTribe,
  TribeSwitch,
} from '../../data/ssn/dataTypes';
import survivorsData, {
  SurvivorData,
} from '../../data/survivors/survivorsData';
import eventService from '../../../../services/season/events/eventService';

const survivorProcessor = {
  processSurvivors,
  processTribeMembersForStartingTribe,
  processSurvivorTribeSwitch,
  processEliminatedSurvivors,
  processSurvivorTribeless,
};

async function processSurvivorTribeless(
  episodeId: EpisodeAttributes['id']
): Promise<SurvivorsAttributes['id'][]> {
  logger.debug(`Processing tribeless survivor for episode: ${episodeId}`);

  const episodeAttributes = await models.Episode.findByPk(episodeId);
  if (!episodeAttributes) {
    throw new Error(`Episode with ID ${episodeId} not found in the database`);
  }
  if (episodeAttributes.type !== EpisodeType.TRIBELESS) {
    throw new Error(`Episode with ID ${episodeId} is not a tribeless episode`);
  }

  const preMergeTribeIds = await models.Tribe.findAll({
    where: {
      seasonId: episodeAttributes.seasonId,
      mergeTribe: false,
    },
  }).then((tribes) => tribes.map((tribe) => tribe.id));

  const tribeMembers = await models.TribeMembers.update(
    {
      episodeIdEnd: episodeId,
    },
    {
      where: {
        episodeIdEnd: null,
        tribeId: { [Op.in]: preMergeTribeIds },
      },
      returning: true,
    }
  );

  logger.debug(`Processed tribeless survivor for episode: ${episodeId}`);
  return tribeMembers[1].map((tribeMember) => tribeMember.survivorId);
}

async function processSurvivorTribeSwitch(
  tribeSwitch: TribeSwitch,
  episodeId: EpisodeAttributes['id']
) {
  for (const survivorTribeSwitch of tribeSwitch) {
    const survivor = await models.Survivors.findByPk(
      survivorTribeSwitch.survivorId
    );
    const tribe = await models.Tribe.findByPk(survivorTribeSwitch.tribeId);

    logger.debug(
      `Processing tribe switch for survivor: ${survivor?.firstName} to tribe: ${tribe?.name}`
    );

    const [numUpdated, rowsUpdated] = await models.TribeMembers.update(
      {
        episodeIdEnd: episodeId,
      },
      {
        where: {
          episodeIdEnd: null,
          survivorId: survivorTribeSwitch.survivorId,
        },
        returning: true,
      }
    );

    logger.debug(
      `Updated ${numUpdated} records for survivor: ${survivor?.firstName} to tribe: ${tribe?.name}`
    );
    for (const rowUpdated of rowsUpdated) {
      const survivorUpdated = await models.Survivors.findByPk(
        rowUpdated.survivorId
      );
      const tribeUpdated = await models.Tribe.findByPk(rowUpdated.tribeId);
      logger.debug(
        `Updated Record = ${survivorUpdated?.firstName} in tribe: ${tribeUpdated?.name}`
      );
    }

    logger.debug(
      `Updating tribe member record for survivor: ${survivor?.firstName} to tribe: ${tribe?.name}`
    );

    await models.TribeMembers.create({
      survivorId: survivorTribeSwitch.survivorId,
      tribeId: survivorTribeSwitch.tribeId,
      episodeIdStart: episodeId,
      episodeIdEnd: null,
      notes: `Switched to tribe ${survivorTribeSwitch.tribeId}`,
    });

    await models.Episode.update(
      {
        isTribeSwitch: true,
      },
      {
        where: {
          id: episodeId,
        },
      }
    );
  }
}

async function processEliminatedSurvivors(
  eliminatedSurvivors: EliminatedSurvivors,
  episodeId: EpisodeAttributes['id']
) {
  logger.debug(`Processing eliminated survivors`);

  const episodeAttributes = await models.Episode.findByPk(episodeId);
  if (!episodeAttributes) {
    throw new Error(`Episode with ID ${episodeId} not found in the database`);
  }

  eventService.processSurvivorElimination({
    episodeId: episodeId,
    survivorEliminations: eliminatedSurvivors.map((eliminatedSurvivor) => {
      return {
        survivorId: eliminatedSurvivor.survivorId,
        day: eliminatedSurvivor.day,
        rank: eliminatedSurvivor.placement,
      };
    }),
  });

  logger.debug(`Processed eliminated survivors`);
}

async function processEliminatedSurvivor(
  eliminatedSurvivor: EliminatedSurvivor,
  episodeId: EpisodeAttributes['id'],
  seasonId: SeasonsAttributes['seasonId']
) {
  const survivorDetails = (await models.Survivors.findByPk(
    eliminatedSurvivor.survivorId,
    {
      include: [
        {
          model: models.SurvivorDetailsOnSeason,
          as: 'SurvivorDetailsOnSeason',
          where: {
            seasonId: seasonId,
          },
        },
      ],
    }
  )) as unknown as
    | null
    | (SurvivorsAttributes & {
        SurvivorDetailsOnSeason: SurvivorDetailsOnSeasonAttributes;
      });

  if (!survivorDetails) {
    throw new Error(
      `Survivor with ID ${eliminatedSurvivor.survivorId} not found tied to season ${seasonId}`
    );
  }

  logger.debug(
    `Processing eliminated survivor: ${survivorDetails.firstName} ${survivorDetails.lastName}`
  );

  await seedEliminatedSurvivorTable(seasonId, episodeId, eliminatedSurvivor);
  await seedTribeMemberTableForElimination(
    eliminatedSurvivor.survivorId,
    episodeId,
    seasonId
  );

  logger.debug(
    `Processed eliminated survivor: ${survivorDetails.firstName} ${survivorDetails.lastName}`
  );
}

async function seedTribeMemberTableForElimination(
  survivorId: SurvivorsAttributes['id'],
  episodeId: EpisodeAttributes['id'],
  seasonId: SeasonsAttributes['seasonId']
) {
  logger.debug(
    `${models.TribeMembers.tableName}: Starting data processing for survivor ${survivorId} in season ${seasonId}`
  );

  const tribes = await models.Tribe.findAll({
    where: {
      seasonId: seasonId,
    },
  });
  if (tribes.length === 0) {
    throw new Error(
      `No tribes found for season ${seasonId}. Cannot process tribe members for survivor ${survivorId}`
    );
  }

  const tribeMemberRecord = await models.TribeMembers.findOne({
    where: {
      survivorId: survivorId,
      episodeIdEnd: null,
      tribeId: { [Op.in]: tribes.map((tribe) => tribe.id) },
    },
  });

  if (!tribeMemberRecord) {
    throw new Error(
      `Tribe member record not found for survivor ${survivorId} in season ${seasonId}. Cannot process tribe members for elimination`
    );
  }

  logger.debug(
    `${models.TribeMembers.tableName}: Updating record for survivor: ${survivorId} in season: ${seasonId}`
  );
  await models.TribeMembers.update(
    {
      episodeIdEnd: episodeId,
      notes: `Eliminated`,
    },
    {
      where: {
        survivorId: survivorId,
        tribeId: tribeMemberRecord.tribeId,
        episodeIdStart: tribeMemberRecord.episodeIdStart,
        episodeIdEnd: null,
      },
    }
  );
  logger.debug(
    `${models.TribeMembers.tableName}: Updated record for survivor: ${survivorId} in season: ${seasonId}`
  );
}

async function seedEliminatedSurvivorTable(
  seasonId: SeasonsAttributes['seasonId'],
  episodeId: EpisodeAttributes['id'],
  eliminatedSurvivor: EliminatedSurvivor
) {
  logger.debug(
    `${models.SeasonEliminations.tableName}: Starting data processing for ${eliminatedSurvivor.survivorId}`
  );

  const numDeleted = await models.SeasonEliminations.destroy({
    where: {
      seasonId: seasonId,
      episodeId: episodeId,
      survivorId: eliminatedSurvivor.survivorId,
    },
  });
  if (numDeleted !== 0) {
    logger.debug(
      `${models.SeasonEliminations.tableName}: Deleted ${numDeleted} records for survivor: ${eliminatedSurvivor.survivorId} in season: ${seasonId}`
    );
  }

  logger.debug(
    `${models.SeasonEliminations.tableName}: Creating record for survivor: ${eliminatedSurvivor.survivorId} in season: ${seasonId}`
  );
  await models.SeasonEliminations.create({
    seasonId: seasonId,
    episodeId: episodeId,
    placement: eliminatedSurvivor.placement,
    survivorId: eliminatedSurvivor.survivorId,
    notes: eliminatedSurvivor.notes,
    day: eliminatedSurvivor.day,
    seq: eliminatedSurvivor.seq,
  });
  logger.debug(
    `${models.SeasonEliminations.tableName}: Created record for survivor: ${eliminatedSurvivor.survivorId} in season: ${seasonId}`
  );
}

async function processSurvivors(seasonId: SeasonsAttributes['seasonId']) {
  logger.debug(`Processing survivors for season: ${seasonId}`);
  const allSurvivors = survivorsData;

  const survivorsInSeason = allSurvivors.filter((survivor) => {
    return survivor.seasonDetails?.get(seasonId);
  });

  logger.debug(
    `Found ${survivorsInSeason.length} survivors for season: ${seasonId}`
  );

  for (const survivor of survivorsInSeason) {
    await processSurvivor(survivor, seasonId);
  }

  logger.debug(`Processed all survivors for season: ${seasonId}`);
}

async function processSurvivor(
  survivor: SurvivorData,
  seasonId: SeasonsAttributes['seasonId']
) {
  logger.debug(
    `Processing survivor: ${survivor.firstName} ${survivor.lastName}`
  );

  await seedSurvivorTable(survivor);
  await seedSurvivorSeasonTable(survivor, seasonId);
  logger.debug(
    `Processed survivor: ${survivor.firstName} ${survivor.lastName}`
  );
}

async function seedSurvivorTable(survivor: SurvivorData) {
  logger.debug(
    `${models.Survivors.tableName}: Starting data processing for ${survivor.id}`
  );
  const survivorInDatabase = await models.Survivors.findByPk(survivor.id);

  if (survivorInDatabase) {
    logger.debug(
      `${models.Survivors.tableName}: Survivor ${survivor.id} already exists`
    );
    return;
  } else {
    logger.debug(
      `${models.Survivors.tableName}: Creating survivor ${survivor.id}`
    );
    await models.Survivors.create({
      id: survivor.id,
      firstName: survivor.firstName,
      nickName: survivor.nickName,
      lastName: survivor.lastName,
      fromCity: survivor.fromCity,
      fromState: survivor.fromState,
      fromCountry: survivor.fromCountry,
    });
    logger.debug(
      `${models.Survivors.tableName}: Created survivor ${survivor.id}`
    );
  }
}

async function seedSurvivorSeasonTable(
  survivor: SurvivorData,
  seasonId: SeasonsAttributes['seasonId']
) {
  logger.debug(
    `${models.SurvivorDetailsOnSeason.tableName}: Starting data processing for ${survivor.id}`
  );

  const numDeleted = await models.SurvivorDetailsOnSeason.destroy({
    where: { id: survivor.id, seasonId: seasonId },
  });
  if (numDeleted !== 0) {
    logger.debug(
      `${models.SurvivorDetailsOnSeason.tableName}: Deleted ${numDeleted} records for survivor: ${survivor.id} in season: ${seasonId}`
    );
  }

  logger.debug(
    `${models.SurvivorDetailsOnSeason.tableName}: Creating record for survivor: ${survivor.id} in season: ${seasonId}`
  );
  await models.SurvivorDetailsOnSeason.create({
    id: survivor.id,
    seasonId: seasonId,
    age: survivor.seasonDetails!.get(seasonId)!.age,
    description: survivor.seasonDetails!.get(seasonId)!.description,
    job: survivor.seasonDetails!.get(seasonId)!.job,
  });
  logger.debug(
    `${models.SurvivorDetailsOnSeason.tableName}: Created record for survivor: ${survivor.id} in season: ${seasonId}`
  );
}

async function processTribeMembersForStartingTribe(
  startingTribe: StartingTribe,
  seasonId: SeasonsAttributes['seasonId']
) {
  logger.debug(
    `Processing ${startingTribe.startingSurvivors.length} survivors in starting tribe: ${startingTribe.name}`
  );

  const premierEpisode = await models.Episode.findOne({
    where: {
      seasonId: seasonId,
      type: EpisodeType.PREMIERE,
    },
  });
  if (!premierEpisode) {
    throw new Error(
      `No premiere episode found for season ${seasonId}. Cannot process starting tribe members ${startingTribe.name}`
    );
  }

  for (const survivorId of startingTribe.startingSurvivors) {
    await processSurvivorInStartingTribe(
      survivorId,
      startingTribe.episodeIdStart!,
      startingTribe.id
    );
  }

  logger.debug(
    `Processed ${startingTribe.startingSurvivors.length} survivors in starting tribe: ${startingTribe.name}`
  );
}

async function processSurvivorInStartingTribe(
  survivorId: SurvivorsAttributes['id'],
  premierEpisodeId: TribeMemberAttributes['episodeIdStart'],
  tribeId: TribeAttributes['id']
) {
  const survivorDetails = await models.Survivors.findByPk(survivorId);
  const tribeDetails = await models.Tribe.findByPk(tribeId);
  if (!survivorDetails) {
    throw new Error(`Survivor with ID ${survivorId} not found`);
  }
  if (!tribeDetails) {
    throw new Error(`Tribe with ID ${tribeId} not found`);
  }
  const survivorInSeason = await models.SurvivorDetailsOnSeason.findOne({
    where: {
      id: survivorId,
      seasonId: tribeDetails.seasonId,
    },
  });
  if (!survivorInSeason) {
    throw new Error(
      `Survivor ${survivorDetails.firstName} ${survivorDetails.lastName} is not tied to season ${tribeDetails.seasonId}. Cannot assign to tribe ${tribeId}`
    );
  }

  logger.debug(
    ` Processing survivor ${survivorDetails.firstName} ${survivorDetails.lastName} to start in tribe ${tribeDetails.name}`
  );

  await seedTribeMemberTableForStartingTribe(
    survivorId,
    tribeId,
    premierEpisodeId,
    `Started season ${tribeDetails.seasonId} in tribe ${tribeDetails.name}`
  );

  logger.debug(
    `Processed survivor ${survivorDetails.firstName} ${survivorDetails.lastName} to start in tribe ${tribeDetails.name}`
  );
}

async function seedTribeMemberTableForStartingTribe(
  survivorId: SurvivorsAttributes['id'],
  tribeId: TribeAttributes['id'],
  episodeId: TribeMemberAttributes['episodeIdStart'],
  notes: TribeMemberAttributes['notes']
) {
  logger.debug(
    `${models.TribeMembers.tableName}: Starting data processing for survivor ${survivorId} in tribe ${tribeId}`
  );

  const numDeleted = await models.TribeMembers.destroy({
    where: { survivorId: survivorId, tribeId: tribeId },
  });
  if (numDeleted !== 0) {
    logger.debug(
      `${models.TribeMembers.tableName}: Deleted ${numDeleted} records for survivor: ${survivorId} in tribe: ${tribeId}`
    );
  }

  logger.debug(
    `${models.TribeMembers.tableName}: Creating record for survivor: ${survivorId} in tribe: ${tribeId}`
  );
  await models.TribeMembers.create({
    survivorId: survivorId,
    tribeId: tribeId,
    episodeIdStart: episodeId,
    episodeIdEnd: null,
    notes: notes,
  });
  logger.debug(
    `${models.TribeMembers.tableName}: Created record for survivor: ${survivorId} in tribe: ${tribeId}`
  );
}

export default survivorProcessor;
