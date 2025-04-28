import { v4 } from 'uuid';
import { LeagueMemberRole } from '../../generated-api';
import { LeagueProfileAttributes } from '../../models/league/LeagueProfile';
import { Account } from '../account/Account';
import { League } from './League';
import { UUID } from 'crypto';

import { LeagueMember as LeagueMemberDTO } from '../../generated-api';

export class LeagueMember {
  protected id: LeagueProfileAttributes['id'];
  protected role = LeagueMemberRole.Member;
  protected account: Account;
  protected league!: League;

  constructor({
    id = v4() as UUID,
    account,
    league,
  }: {
    id?: LeagueProfileAttributes['id'];
    account: Account;
    league: League;
  }) {
    this.id = id;
    this.account = account;
    this.league = league;
  }

  getId(): LeagueProfileAttributes['id'] {
    return this.id;
  }
  getRole(): LeagueProfileAttributes['role'] {
    return this.role;
  }
  getAccount(): Account {
    return this.account;
  }

  getLeague(): League {
    return this.league;
  }

  toDTO(): LeagueMemberDTO {
    return {
      profile: this.account.toDTO(),
      role: this.role,
      leagueProfileId: this.id,
      hasJoined: true,
      totalPoints: 0,
    };
  }
}

export class LeagueAdmin extends LeagueMember {
  protected role = LeagueMemberRole.Admin;

  constructor({
    id = v4() as UUID,
    account,
    league,
  }: {
    id?: LeagueProfileAttributes['id'];
    account: Account;
    league: League;
  }) {
    super({ id, account, league });
  }
}

export class LeagueOwner extends LeagueAdmin {
  protected role = LeagueMemberRole.Owner;

  constructor({
    id = v4() as UUID,
    account,
    league,
  }: {
    id?: LeagueProfileAttributes['id'];
    account: Account;
    league: League;
  }) {
    super({ id, account, league });
  }
}
