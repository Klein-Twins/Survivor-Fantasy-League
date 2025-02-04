import { Transaction } from 'sequelize';
import { InviteStatusEnum, LeagueProfileAttributes } from '../../models/league/LeagueProfile';
import { RespondLeagueInvite } from '../../types/league/leagueTypes';
import { models, sequelize } from '../../config/db';
import errorFactory from '../../utils/errors/errorFactory';
import logger from '../../config/logger';

async function respondToLeagueInvite(
  leagueId: string,
  profileId: string,
  respondStatus: RespondLeagueInvite,
  transaction?: Transaction
): Promise<LeagueProfileAttributes | null> {
  const t: Transaction = transaction || (await sequelize.transaction());

  try {
    if (respondStatus === RespondLeagueInvite.Accept) {
      const [numberOfAffectedRows, [updatedLeagueProfile]] = await models.LeagueProfile.update(
        { inviteStatus: InviteStatusEnum.Accepted },
        {
          where: {
            profileId,
            leagueId,
            inviteStatus: InviteStatusEnum.Pending,
          },
          returning: true,
          transaction: t,
        }
      );
      if (!transaction) {
        await t.commit();
      }
      return updatedLeagueProfile ? updatedLeagueProfile.get() : null;
    } else if (respondStatus === RespondLeagueInvite.Decline) {
      const leagueProfiles = await models.LeagueProfile.findAll({
        where: {
          profileId,
          leagueId,
          inviteStatus: InviteStatusEnum.Pending,
        },
        transaction: t,
      });
      if (!leagueProfiles || leagueProfiles.length !== 1) {
        const logMessage: string = !leagueProfiles
          ? `No pending league invite found for profile ${profileId} to league ${leagueId}`
          : `Found ${leagueProfiles.length} league invites for profile ${profileId} to league ${leagueId}`;
        logger.debug(logMessage);
        if (!transaction) {
          await t.rollback();
        }
        return null;
      }
      const leagueProfile: LeagueProfileAttributes = leagueProfiles[0].get();

      const numDeletedRows = await models.LeagueProfile.destroy({
        where: {
          profileId,
          leagueId,
          inviteStatus: InviteStatusEnum.Pending,
        },
        transaction: t,
      });
      if (numDeletedRows != 1) {
        logger.debug('Unexpected Deletion of multiple entries in LeagueProfile table. Rolling back transaction');
        await t.rollback();
        return null;
      }
      if (!transaction) {
        await t.commit();
      }
      logger.debug(`Successfully Deleted leagueInvite for profile ${profileId} to league ${leagueId}`);
      return leagueProfile;
    } else {
      if (!transaction) {
        await t.rollback();
      }
      throw errorFactory({ statusCode: 500, error: 'Invalid RespondStatus' });
    }
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export default {
  respondToLeagueInvite,
};
