import { Transaction } from 'sequelize';
import { LeagueMember } from '../../generated-api';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';
import { LeagueAttributes } from '../../models/league/League';
import { ProfileAttributes } from '../../models/account/Profile';

const leagueMemberService = {
  getLeagueMembers,
  getLeagueProfile,
  isProfileInLeague,
};

async function getLeagueMembers(
  leagueId: LeagueAttributes['leagueId'],
  transaction?: Transaction
): Promise<LeagueMember[]> {
  return await leagueMemberRepository.getLeagueMembers(leagueId, transaction);
}

async function getLeagueProfile(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId']
) {
  return await leagueMemberRepository.getLeagueProfile(leagueId, profileId);
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

export default leagueMemberService;
