import { Transaction } from 'sequelize';
import { models, sequelize } from '../../config/db';
import { LeagueMember, LeagueMemberRoleEnum } from '../../generated-api';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';
import { LeagueAttributes } from '../../models/league/League';
import { ProfileAttributes } from '../../models/account/Profile';
import { InviteStatusEnum } from '../../models/league/LeagueProfile';

const leagueMemberService = {
  createLeagueOwner,
  getLeagueMembers,
  isProfileInLeague,
};

async function getLeagueMembers(
  leagueId: LeagueAttributes['leagueId'],
  transaction?: Transaction
): Promise<LeagueMember[]> {
  return await leagueMemberRepository.getLeagueMembers(leagueId, transaction);
}

async function isProfileInLeague(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId'],
  transaction?: Transaction
): Promise<boolean> {
  try {
    await leagueMemberRepository.getLeagueProfile(
      leagueId,
      profileId,
      transaction
    );
    return true;
  } catch (error) {
    return false;
  }
}

async function createLeagueOwner(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId'],
  transaction?: Transaction
): Promise<LeagueMember> {
  let t = transaction;
  if (!transaction) {
    t = await sequelize.transaction();
  }
  try {
    //TODO: Validate that no owner and no current league members
    const leagueMember: LeagueMember =
      await leagueMemberRepository.createLeagueMember(
        leagueId,
        profileId,
        null,
        LeagueMemberRoleEnum.OWNER,
        InviteStatusEnum.Accepted,
        t
      );
    if (!transaction && t) {
      await t.commit();
    }
    return leagueMember;
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

export default leagueMemberService;
