import { UUID } from 'crypto';
import { League } from '../League';
import { Account } from '../../account/Account';
import { LeagueMember } from '../LeagueMember';
import { ConflictError } from '../../../utils/errors/errors';
import { LeagueInvite as LeagueInviteDTO } from '../../../generated-api';

export class LeagueInvite {
  private league: League;
  private id: UUID;
  private invitedAccount: Account;
  private inviters: LeagueMember[];

  constructor(
    league: League,
    id: UUID,
    invitedAccount: Account,
    inviters: LeagueMember[]
  ) {
    this.league = league;
    this.id = id;
    this.invitedAccount = invitedAccount;
    this.inviters = inviters;
  }

  getLeague(): League {
    return this.league;
  }
  getId(): UUID {
    return this.id;
  }
  getInvitedAccount(): Account {
    return this.invitedAccount;
  }
  getInviters(): LeagueMember[] {
    return this.inviters;
  }

  addInviter(inviter: LeagueMember): void {
    if (
      this.inviters.some(
        (leagueMember) =>
          leagueMember.getAccount().getAccountId() ===
          inviter.getAccount().getAccountId()
      )
    ) {
      throw new ConflictError('Inviter already exists in the invite');
    }
    this.inviters.push(inviter);
  }

  toDTO(): LeagueInviteDTO {
    return {
      inviteId: this.id,
      league: this.league.toDTO(),
      inviterProfiles: this.inviters.map((inviter) =>
        inviter.getAccount().toDTO()
      ),
    };
  }
}
