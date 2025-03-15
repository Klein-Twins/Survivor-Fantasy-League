import { Transaction } from 'sequelize';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueInvite, LeagueMemberRole } from '../../generated-api';
import {
  InviteStatusEnum,
  LeagueProfileAttributes,
} from '../../models/league/LeagueProfile';
import { models } from '../../config/db';
import { v4 as uuidv4 } from 'uuid';
import { LeagueAttributes } from '../../models/league/League';
import leagueInviteHelper from '../../helpers/league/leagueInviteHelper';
import { InternalServerError } from '../../utils/errors/errors';
import logger from '../../config/logger';

const leagueInviteRepository = {
  getLeagueInvitesForProfileId,
  createLeagueInvite,
  getLeagueInviteByProfileIdAndLeagueId,
  acceptLeagueInvite,
  declineLeagueInvite,
};

async function acceptLeagueInvite(
  leagueInvite: LeagueInvite,
  transaction?: Transaction
) {
  let t = transaction;
  if (!transaction) {
    t = await models.sequelize.transaction();
  }
  try {
    await models.LeagueProfile.update(
      {
        inviteStatus: InviteStatusEnum.Accepted,
      },
      {
        where: {
          id: leagueInvite.inviteId,
        },
        transaction: t,
      }
    );

    if (!transaction && t) {
      await t.commit();
    }
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

async function declineLeagueInvite(
  leagueInvite: LeagueInvite,
  transaction?: Transaction
) {
  let t = transaction;
  if (!transaction) {
    t = await models.sequelize.transaction();
  }
  try {
    const numDeleted = await models.LeagueProfile.destroy({
      where: {
        id: leagueInvite.inviteId,
      },
      transaction: t,
    });

    if (numDeleted !== 1) {
      logger.error(`Error declining league invite: ${leagueInvite.inviteId}`);
      logger.error(
        `Expecting 1 row to be deleted, but deleted ${numDeleted} rows. Rolling back changes.`
      );
      throw new InternalServerError('Error declining league invite');
    }

    if (!transaction && t) {
      await t.commit();
    }
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

async function getLeagueInviteByProfileIdAndLeagueId(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId'],
  transaction?: Transaction
): Promise<LeagueInvite | null> {
  const inviteLeagueProfile: LeagueProfileAttributes | null =
    await models.LeagueProfile.findOne({
      where: {
        leagueId,
        profileId,
      },
      transaction,
    });

  if (!inviteLeagueProfile) {
    return null;
  }
  return await leagueInviteHelper.buildLeagueInvite(inviteLeagueProfile);
}

async function getLeagueInvitesForProfileId(
  profileId: ProfileAttributes['profileId'],
  transaction?: Transaction
): Promise<LeagueInvite[]> {
  const inviteLeagueProfiles: LeagueProfileAttributes[] =
    await models.LeagueProfile.findAll({
      where: {
        profileId: profileId,
        inviteStatus: InviteStatusEnum.Pending,
      },
      transaction,
    });

  if (inviteLeagueProfiles.length === 0) {
    return [];
  }

  const leagueInvites: Promise<LeagueInvite>[] = inviteLeagueProfiles.map(
    async (inviteLeagueProfile) => {
      return await leagueInviteHelper.buildLeagueInvite(inviteLeagueProfile);
    }
  );

  return Promise.all(leagueInvites);
}

async function createLeagueInvite(
  leagueId: LeagueAttributes['leagueId'],
  inviterProfileId: ProfileAttributes['profileId'],
  invitedProfileId: ProfileAttributes['profileId'],
  transaction?: Transaction
): Promise<LeagueInvite> {
  let t = transaction;
  if (!transaction) {
    t = await models.sequelize.transaction();
  }
  try {
    const inviteLeagueProfile: LeagueProfileAttributes =
      await models.LeagueProfile.create(
        {
          id: uuidv4(),
          leagueId,
          profileId: invitedProfileId,
          inviterProfileId,
          role: LeagueMemberRole.Member,
          inviteStatus: InviteStatusEnum.Pending,
        },
        { transaction: t }
      );

    const leagueInvite: LeagueInvite =
      await leagueInviteHelper.buildLeagueInvite(inviteLeagueProfile);

    if (!transaction && t) {
      await t.commit();
    }

    return leagueInvite;
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

export default leagueInviteRepository;
