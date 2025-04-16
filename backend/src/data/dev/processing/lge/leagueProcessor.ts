import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { LeagueMemberRole } from '../../../../generated-api';
import { InviteStatus } from '../../../../models/league/LeagueProfile';
import leagueService from '../../../../services/league/leagueService';
import { League } from '../../leagueData/leagues48';

const leagueProcessor = {
  processLeague,
};

async function processLeague(leageuData: League) {
  await models.League.destroy({
    where: {
      seasonId: leageuData.seasonId,
      name: leageuData.name,
    },
  });

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
