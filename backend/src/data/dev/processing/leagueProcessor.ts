import { container } from 'tsyringe';
import { SeedLeague, SeedLeagues } from '../data/league/ssn/48/leagueData';
import { LeagueService } from '../../../services/league/LeagueService';
import { League } from '../../../domain/league/League';
import leagueInviteProcessor from './leagueInviteProcessor';
import logger from '../../../config/logger';

const leagueProcessor = {
  processLeagues,
  processLeague,
};

async function processLeagues(leaguesData: SeedLeagues) {
  for (const leagueData of leaguesData) {
    await processLeague(leagueData);
  }
}

async function processLeague(leagueData: SeedLeague): Promise<League> {
  //Process league creation
  const league = await container.resolve(LeagueService).createLeague({
    profileId: leagueData.owner.profileId,
    seasonId: leagueData.seasonId,
    name: leagueData.name,
    leagueProfileId: leagueData.owner.leagueProfileId,
    leagueId: leagueData.leagueId,
  });

  await container.resolve(LeagueService).saveLeague(league);

  //Process sending league invites
  for (const invite of leagueData.invites) {
    logger.debug(`\n\nProcessing league invite for league ${league.getName()}`);
    logger.debug(
      `Inviter: ${invite.inviterProfileId}, Invited: ${invite.invitedProfileId}, Response: ${invite.inviteResponse}`
    );
    logger.debug(`Sending invite to league ${league.getName()}`);
    await leagueInviteProcessor.processSendLeagueInvite({
      inviterProfileId: invite.inviterProfileId,
      invitedProfileId: invite.invitedProfileId,
      leagueId: leagueData.leagueId,
    });
    logger.debug(`Invite sent to league ${league.getName()}`);
    logger.debug(
      `Processing response for invite to league ${league.getName()}`
    );
    await leagueInviteProcessor.processRespondToLeagueInvite({
      leagueId: leagueData.leagueId,
      invitedProfileId: invite.invitedProfileId,
      inviteResponse: invite.inviteResponse,
    });
    logger.debug(`Response processed for invite to league ${league.getName()}`);
    logger.debug(
      `League invite processing complete for league ${league.getName()}`
    );
  }

  return league;
}

export default leagueProcessor;
