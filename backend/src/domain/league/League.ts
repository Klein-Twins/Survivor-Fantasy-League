import { v4 } from 'uuid';
import { LeagueAttributes } from '../../models/league/League';
import { LeagueMember, LeagueOwner } from './LeagueMember';
import { UUID } from 'crypto';
import { ConflictError } from '../../utils/errors/errors';
import { League as LeagueDTO } from '../../generated-api';

export class League {
  private id: LeagueAttributes['leagueId'];
  private seasonId!: LeagueAttributes['seasonId'];
  private name!: LeagueAttributes['name'];
  private leagueMembers!: LeagueMember[];
  private leagueOwner!: LeagueOwner;

  constructor({
    id = v4() as UUID,
    seasonId,
    name,
  }: {
    id?: LeagueAttributes['leagueId'];
    seasonId: LeagueAttributes['seasonId'];
    name: LeagueAttributes['name'];
  }) {
    this.id = id;
    this.seasonId = seasonId;
    this.name = name;
    this.leagueMembers = [];
  }

  getId(): LeagueAttributes['leagueId'] {
    return this.id;
  }
  getSeasonId(): LeagueAttributes['seasonId'] {
    return this.seasonId;
  }
  getName(): LeagueAttributes['name'] {
    return this.name;
  }
  getLeagueMembers(): LeagueMember[] {
    return this.leagueMembers;
  }

  /**
   * This method will add the league owner to the league as well as add the league owner to the members
   * @param leagueOwner
   * @throws {ConflictError} if the league already has an owner
   */
  addLeagueOwner(leagueOwner: LeagueOwner): void {
    if (this.leagueOwner) {
      throw new ConflictError('League already has an owner');
    }
    this.leagueOwner = leagueOwner;

    this.addLeagueMember(leagueOwner);
  }

  /**
   * @param leagueMember
   * @throws {ConflictError} if the league already has this member
   */
  addLeagueMember(leagueMember: LeagueMember): void {
    if (
      this.leagueMembers.some(
        (member) =>
          member.getAccount().getAccountId() ===
          leagueMember.getAccount().getAccountId()
      )
    ) {
      throw new ConflictError('League already has this member');
    }
    this.leagueMembers.push(leagueMember);
  }

  toDTO(): LeagueDTO {
    return {
      id: this.id,
      name: this.name,
      seasonId: this.seasonId,
      leagueMembers: this.leagueMembers.map((member) => member.toDTO()),
    };
  }
}
