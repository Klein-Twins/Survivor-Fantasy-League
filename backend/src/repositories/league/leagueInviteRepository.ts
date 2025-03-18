import { Transaction } from 'sequelize';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueAttributes } from '../../models/league/League';
import {
  InviteStatus,
  LeagueProfileAttributes,
} from '../../models/league/LeagueProfile';
import { models } from '../../config/db';
import { v4 as uuidv4 } from 'uuid';
import { LeagueMemberRole } from '../../generated-api';

const leagueInviteRepository = {
  createLeagueInvite,
  acceptLeagueInvite,
  declineLeagueInvite,
};

async function acceptLeagueInvite(
  inviteId: LeagueProfileAttributes['id'],
  transaction?: Transaction
): Promise<void> {
  let t = transaction;
  if (!transaction) {
    t = await models.sequelize.transaction();
  }
  try {
    const affectedRows = await models.LeagueProfile.update(
      {
        inviteStatus: InviteStatus.Accepted,
        role: LeagueMemberRole.Member,
      },
      {
        where: {
          id: inviteId,
        },
        transaction: t,
        returning: true,
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
  inviteId: LeagueProfileAttributes['id'],
  transaction?: Transaction
): Promise<void> {
  let t = transaction;
  if (!transaction) {
    t = await models.sequelize.transaction();
  }
  try {
    await models.LeagueProfile.destroy({
      where: {
        id: inviteId,
      },
      transaction: t,
    });

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

async function createLeagueInvite(
  leagueId: LeagueAttributes['leagueId'],
  inviterProfileId: ProfileAttributes['profileId'],
  invitedProfileId: ProfileAttributes['profileId'],
  transaction?: Transaction
): Promise<LeagueProfileAttributes> {
  {
    let t = transaction;
    if (!transaction) {
      t = await models.sequelize.transaction();
    }
    try {
      const leagueProfileId = uuidv4();
      const inviteLeagueProfile: LeagueProfileAttributes =
        await models.LeagueProfile.create(
          {
            id: leagueProfileId,
            leagueId,
            profileId: invitedProfileId,
            inviterProfileId,
            role: LeagueMemberRole.Invited,
            inviteStatus: InviteStatus.Pending,
          },
          { transaction: t }
        );

      if (!transaction && t) {
        await t.commit();
      }

      return inviteLeagueProfile;
    } catch (error) {
      if (!transaction && t) {
        await t.rollback();
      }
      throw error;
    }
  }
}

export default leagueInviteRepository;
