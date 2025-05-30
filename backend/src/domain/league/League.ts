import { v4 } from 'uuid';
import { LeagueAttributes } from '../../models/league/League';
import { LeagueMember, LeagueOwner } from './LeagueMember';
import { UUID } from 'crypto';
import { ConflictError, NotFoundError } from '../../utils/errors/errors';
import { League as LeagueDTO } from '../../generated-api';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueInvite } from './invite/LeagueInvite';
import { Account } from '../account/Account';

export class League {
  private id: LeagueAttributes['leagueId'];
  private seasonId!: LeagueAttributes['seasonId'];
  private name!: LeagueAttributes['name'];
  private leagueMembers!: LeagueMember[];
  private leagueOwner!: LeagueOwner;
  //Map of invitedProfileId to LeagueInvite
  private leagueInvites!: Map<UUID, LeagueInvite>;

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
    this.leagueInvites = new Map<UUID, LeagueInvite>();
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
  getLeagueOwner(): LeagueOwner {
    return this.leagueOwner;
  }

  getLeagueInviteByProfileId(
    invitedProfileId: ProfileAttributes['profileId']
  ): LeagueInvite | undefined {
    return this.leagueInvites.get(invitedProfileId);
  }

  getLeagueInvites(): Map<UUID, LeagueInvite> {
    return this.leagueInvites;
  }
  // setLeagueInvites(leagueInvites: Map<UUID, LeagueInvite>): void {
  //   this.leagueInvites = leagueInvites;
  // }
  // addLeagueInvite(leagueInvite: LeagueInvite): void {
  //   if (this.leagueInvites.has(leagueInvite.getId())) {
  //     throw new ConflictError('League invite already exists');
  //   }
  //   this.leagueInvites.set(leagueInvite.getId(), leagueInvite);
  // }

  inviteProfileToLeague(
    invitedAccount: Account,
    inviter: LeagueMember,
    inviteId: UUID = v4() as UUID
  ): LeagueInvite {
    const existingLeagueInvite = this.leagueInvites.get(
      invitedAccount.getProfileId()
    );
    if (existingLeagueInvite) {
      // If the league invite already exists, add the inviter to the existing invite
      existingLeagueInvite.addInviter(inviter);
      return existingLeagueInvite;
    } else {
      //If the league invite does not exist, create a new one
      const leagueInvite = new LeagueInvite(this, invitedAccount, [
        { inviterLeagueMember: inviter, inviteId },
      ]);
      this.leagueInvites.set(invitedAccount.getProfileId(), leagueInvite);
      return leagueInvite;
    }
  }

  removeLeagueInvite(leagueInvite: LeagueInvite): void {
    if (
      !this.leagueInvites.has(leagueInvite.getInvitedAccount().getProfileId())
    ) {
      throw new NotFoundError('League invite not found in league');
    }
    this.leagueInvites.delete(leagueInvite.getInvitedAccount().getProfileId());
  }

  getLeagueMemberByProfileId(
    profileId: ProfileAttributes['profileId']
  ): LeagueMember {
    const leagueMember = this.leagueMembers.find(
      (member) => member.getAccount().getProfileId() === profileId
    );
    if (!leagueMember) {
      throw new NotFoundError(`League member is not in league: ${this.name}`);
    }
    return leagueMember;
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
