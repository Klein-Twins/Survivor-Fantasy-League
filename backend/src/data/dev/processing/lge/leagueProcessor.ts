import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { LeagueMemberRole } from '../../../../generated-api';
import { InviteStatus } from '../../../../models/league/LeagueProfile';
import { SeasonsAttributes } from '../../../../models/season/Seasons';
import leagueService from '../../../../services/league/leagueService';
import { Episode } from '../../../foundation/data/ssn/dataTypes';
import season48TestLeagues, { League } from '../../leagueData/leagues48';

const leagueProcessor = {
  processLeague,
  processLeagues,
};

async function processLeagues(seasonId: SeasonsAttributes['seasonId']) {
  await models.League.destroy({
    where: {
      seasonId,
    },
  });

  if (seasonId === 48) {
    const season48Leagues = season48TestLeagues;
    for (const league of Object.values(season48Leagues)) {
      await processLeague(league);
    }
  }
}

async function processLeague(leageuData: League) {
  logger.info(
    `Processing league data for season ${leageuData.seasonId} | ${leageuData.name}`
  );

  const ownerProfile = leageuData.leagueMembers.find(
    (member) => member.role === LeagueMemberRole.Owner
  );

  if (!ownerProfile) {
    logger.error(
      `Cannot process league: No owner profile found for league ${leageuData.name} in season ${leageuData.seasonId}`
    );
    return;
  }

  const league = await leagueService.createLeague({
    name: leageuData.name,
    seasonId: leageuData.seasonId,
    profileId: ownerProfile.profileId,
    id: leageuData.leagueId,
  });

  const remainingMembers = leageuData.leagueMembers.filter(
    (member) => member.role !== LeagueMemberRole.Owner
  );

  for (const remainingMember of remainingMembers) {
    await models.LeagueProfile.create({
      id: remainingMember.id,
      leagueId: league.id,
      profileId: remainingMember.profileId,
      role: LeagueMemberRole.Member,
      inviteStatus: InviteStatus.Accepted,
      inviterProfileId: ownerProfile.profileId,
    });
  }
}

export default leagueProcessor;
