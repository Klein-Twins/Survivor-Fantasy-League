import { injectable } from 'tsyringe';
import { League } from '../../domain/league/League';
import { Account } from '../../domain/account/Account';
import { UUID } from 'crypto';
import { v4 } from 'uuid';
import { LeagueMember } from '../../domain/league/LeagueMember';

@injectable()
export class LeagueMemberFactory {
  createLeagueMember(
    league: League,
    account: Account,
    leagueProfileId: UUID = v4() as UUID
  ): LeagueMember {
    const leagueMember = new LeagueMember({
      league: league,
      account: account,
      id: leagueProfileId,
    });
    return leagueMember;
  }
}
