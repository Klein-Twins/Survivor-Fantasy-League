import { UUID } from 'crypto';
import { ProfileAttributes } from '../../../models/account/Profile';
import { container } from 'tsyringe';
import { LeagueInviteService } from '../../../services/league/invite/LeagueInviteService';
import { InviteResponse } from '../../../generated-api';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { LeagueAttributes } from '../../../models/league/League';

const leagueInviteProcessor = {
  processSendLeagueInvite,
  processRespondToLeagueInvite,
};

async function processSendLeagueInvite({
  inviterProfileId,
  invitedProfileId,
  leagueId,
}: {
  inviterProfileId: ProfileAttributes['profileId'];
  invitedProfileId: ProfileAttributes['profileId'];
  leagueId: UUID;
}): Promise<void> {
  await container.resolve(LeagueInviteService).sendLeagueInvite({
    inviterProfileId,
    invitedProfileId,
    leagueId,
  });
}

async function processRespondToLeagueInvite({
  leagueId,
  inviteResponse,
  invitedProfileId,
}: {
  leagueId: LeagueAttributes['leagueId'];
  invitedProfileId: ProfileAttributes['profileId'];
  inviteResponse: InviteResponse;
}) {
  await container.resolve(LeagueInviteService).respondToLeagueInvite({
    leagueId,
    invitedProfileId,
    inviteResponse,
  });
}

export default leagueInviteProcessor;
