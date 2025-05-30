import { UUID } from 'crypto';
import { League } from '../League';
import { Account } from '../../account/Account';
import { LeagueMember } from '../LeagueMember';
import { ConflictError } from '../../../utils/errors/errors';
import { LeagueInvite as LeagueInviteDTO } from '../../../generated-api';
import { InviteStatus } from '../../../models/league/LeagueInvites';
import { LeagueInviteAttributes } from '../../../models/league/LeagueInvites';
import { v4 } from 'uuid';

export class LeagueInvite {
  private league: League;
  private invitedAccount: Account;
  private inviters: {
    inviteId: LeagueInviteAttributes['id'];
    inviterLeagueMember: LeagueMember;
  }[];
  private status: InviteStatus;

  constructor(
    league: League,
    invitedAccount: Account,
    inviters: {
      inviteId: LeagueInviteAttributes['id'];
      inviterLeagueMember: LeagueMember;
    }[],
    inviteStatus = InviteStatus.Pending
  ) {
    this.league = league;
    this.invitedAccount = invitedAccount;
    this.inviters = inviters;
    this.status = inviteStatus;
  }

  getLeague(): League {
    return this.league;
  }
  getInvitedAccount(): Account {
    return this.invitedAccount;
  }
  getInviters(): {
    inviteId: LeagueInviteAttributes['id'];
    inviterLeagueMember: LeagueMember;
  }[] {
    return this.inviters;
  }
  getInviteStatus(): InviteStatus {
    return this.status;
  }

  acceptInvite(): void {
    if (this.status !== InviteStatus.Pending) {
      throw new ConflictError('Invite is not pending');
    }
    this.status = InviteStatus.Accepted;

    this.league.removeLeagueInvite(this);
  }

  declineInvite(): void {
    if (this.status !== InviteStatus.Pending) {
      throw new ConflictError('Invite is not pending');
    }
    this.status = InviteStatus.Declined;
    this.league.removeLeagueInvite(this);
  }

  addInviter(inviter: LeagueMember, inviteId: UUID = v4() as UUID): void {
    if (
      this.inviters.some(
        (leagueMember) =>
          leagueMember.inviterLeagueMember.getAccount().getAccountId() ===
          inviter.getAccount().getAccountId()
      )
    ) {
      throw new ConflictError('Inviter already exists in the invite');
    }
    this.inviters.push({ inviteId, inviterLeagueMember: inviter });
  }

  toDTO(): LeagueInviteDTO {
    return {
      league: this.league.toDTO(),
      inviterProfiles: this.inviters.map((inviter) => {
        return {
          profile: inviter.inviterLeagueMember.getAccount().toDTO(),
          inviteId: inviter.inviteId,
        };
      }),
    };
  }
}
