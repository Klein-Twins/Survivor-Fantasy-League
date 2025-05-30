import { UUID } from 'crypto';
import { LeagueInvite } from '../../../domain/league/invite/LeagueInvite';
import { ProfileAttributes } from '../../../models/account/Profile';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { LeagueInviteRepository } from '../../../repositories/league/invite/LeagueInviteRepository';
import { LeagueService } from '../LeagueService';
import { League } from '../../../domain/league/League';
import { delay, inject, injectable } from 'tsyringe';
import { AccountService } from '../../account/AccountService';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  UnauthorizedError,
} from '../../../utils/errors/errors';
import { LeagueMemberHelper } from '../../../helpers/league/LeagueMemberHelper';
import { LeagueInviteHelper } from '../../../helpers/league/LeagueInviteHelper';
import { LeagueMemberService } from '../LeagueMemberService';
import { Transaction } from 'sequelize';
import {
  InviteStatus,
  LeagueInviteAttributes,
} from '../../../models/league/LeagueInvites';
import sequelize from '../../../config/db';
import { LeagueAttributes } from '../../../models/league/League';
import { InviteResponse } from '../../../generated-api';
import { LeagueMemberFactory } from '../../../factory/league/LeagueMemberFactory';

@injectable()
export class LeagueInviteService {
  constructor(
    @inject(AccountService) private accountService: AccountService, // @inject(LeagueService) private leagueService: LeagueService
    @inject(LeagueMemberHelper) private leagueMemberHelper: LeagueMemberHelper,
    @inject(LeagueInviteHelper) private leagueInviteHelper: LeagueInviteHelper,
    @inject(delay(() => LeagueService)) private leagueService: LeagueService,
    @inject(LeagueMemberService)
    private leagueMemberService: LeagueMemberService,
    @inject(LeagueInviteRepository)
    private leagueInviteRepository: LeagueInviteRepository,
    @inject(LeagueMemberFactory)
    private leagueMemberFactory: LeagueMemberFactory
  ) {}

  /**
   *
   * This function fetches all pending league invites for a given league.
   * The database is queried for all pending league invites and will attach the
   * league invites to the league.
   *
   * @param league
   * @returns
   */
  async fetchLeagueInvitesForLeague(
    league: League
  ): Promise<Map<UUID, LeagueInvite>> {
    const pendingLeagueInvitesData =
      await this.leagueInviteRepository.getPendingLeagueInvitesForLeague(
        league
      );

    //Map of leagueId to LeagueInvite, keyed by invitedProfileId
    const leagueInvites = new Map<UUID, LeagueInvite>();

    for (const pendingLeagueInviteData of pendingLeagueInvitesData) {
      const invitedAccount = await this.accountService.fetchAccount(
        'profileId',
        pendingLeagueInviteData.invitedProfileId
      );
      const inviterLeagueMember = league.getLeagueMemberByProfileId(
        pendingLeagueInviteData.inviterProfileId
      );
      const inviteId = pendingLeagueInviteData.id;

      league.inviteProfileToLeague(
        invitedAccount,
        inviterLeagueMember,
        inviteId
      );
    }
    return leagueInvites;
  }

  /**
   * This function fetches the league by leagueId and creates a league invite from the inviter to the invited profile. The league invite is attached to the league and then saved to the DB
   *
   * @param param0
   * @returns
   * @throws UnauthorizedError if the inviter is not in the league
   * @throws ConflictError if the invited profile is already in the league or already invited by the inviter
   * @throws InternalServerError if the league invite is not attached to the league
   */
  async sendLeagueInvite({
    inviterProfileId,
    invitedProfileId,
    leagueId,
  }: {
    inviterProfileId: ProfileAttributes['profileId'];
    invitedProfileId: ProfileAttributes['profileId'];
    leagueId: UUID;
  }): Promise<LeagueInvite> {
    //Check if the inviter is in the league
    const isInviterProfileInLeague =
      await this.leagueMemberHelper.isProfileInLeague(
        inviterProfileId,
        leagueId
      );
    if (!isInviterProfileInLeague) {
      throw new UnauthorizedError(
        'You do not bear a torch for this league, you cannot invite others.'
      );
    }

    //Check if the invited profile is already invited to the league
    const isInvitedProfileInLeague =
      await this.leagueMemberHelper.isProfileInLeague(
        invitedProfileId,
        leagueId
      );
    if (isInvitedProfileInLeague) {
      throw new ConflictError(
        'The invited profile already bears a torch for this league. You cannot invite them again.'
      );
    }

    //Check if the invited profile is already invited to the league
    const isInvitedProfileAlreadyInvitedByInviter =
      await this.leagueInviteHelper.isProfileInvitedToLeagueByInviter(
        invitedProfileId,
        leagueId,
        inviterProfileId
      );
    if (isInvitedProfileAlreadyInvitedByInviter) {
      throw new ConflictError(
        'The invited profile is already invited to this league.'
      );
    }

    const league = await this.leagueService.fetchLeague(leagueId);
    const invitedAccount = await this.accountService.fetchAccount(
      'profileId',
      invitedProfileId
    );
    const inviterLeagueMember =
      league.getLeagueMemberByProfileId(inviterProfileId);

    const leagueInvite = league.inviteProfileToLeague(
      invitedAccount,
      inviterLeagueMember
    );

    const transaction = await sequelize.transaction();
    try {
      await this.saveLeagueInvites(league.getLeagueInvites(), transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    return leagueInvite;
  }

  async getLeagueInvitesForProfile({
    profileId,
    seasonId,
  }: {
    profileId: ProfileAttributes['profileId'];
    seasonId: SeasonsAttributes['seasonId'];
  }): Promise<LeagueInvite[]> {
    const account = await this.accountService.fetchAccount(
      'profileId',
      profileId
    );

    const leagueInviteAttributes =
      await this.leagueInviteRepository.getLeagueInvitesForProfileId(
        profileId,
        seasonId
      );

    const leagueInvites: LeagueInvite[] = [];
    for (const leagueInviteAttribute of leagueInviteAttributes) {
      if (
        leagueInvites.some(
          (invite) =>
            invite.getLeague().getId() === leagueInviteAttribute.leagueId
        )
      ) {
        continue;
      }

      const league = await this.leagueService.fetchLeague(
        leagueInviteAttribute.leagueId
      );

      const leagueInvite = league.getLeagueInviteByProfileId(profileId);
      if (!leagueInvite) {
        throw new InternalServerError('League invite not attached to league.');
      }
      leagueInvites.push(leagueInvite);
    }

    return leagueInvites;
  }

  async respondToLeagueInvite({
    leagueId,
    invitedProfileId,
    inviteResponse,
  }: {
    leagueId: LeagueAttributes['leagueId'];
    invitedProfileId: ProfileAttributes['profileId'];
    inviteResponse: InviteResponse;
  }): Promise<LeagueInvite> {
    const league: League = await this.leagueService.fetchLeague(leagueId);

    //Check to see if profile is invited to the league
    const isProfileInvitedToLeague =
      await this.leagueInviteHelper.isProfileInvitedToLeague(
        invitedProfileId,
        leagueId
      );
    if (!isProfileInvitedToLeague) {
      throw new UnauthorizedError(
        'You are not invited to this league, you cannot respond to the invite.'
      );
    }

    const leagueInvite = league.getLeagueInviteByProfileId(invitedProfileId);
    if (!leagueInvite) {
      throw new InternalServerError(
        'League invite not found for the profile in the league. Should not happen.'
      );
    }

    if (inviteResponse === InviteResponse.Accept) {
      leagueInvite.acceptInvite();
      const leagueMember = this.leagueMemberFactory.createLeagueMember(
        league,
        leagueInvite.getInvitedAccount()
      );
      league.addLeagueMember(leagueMember);
    } else if (inviteResponse === InviteResponse.Decline) {
      leagueInvite.declineInvite();
    } else {
      throw new BadRequestError('Invalid invite response provided.');
    }

    const transaction = await sequelize.transaction();
    try {
      await this.saveAcceptDeclineLeagueInvite(
        leagueInvite,
        inviteResponse,
        transaction
      );
      await this.leagueService.saveLeague(league);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return leagueInvite;
  }

  async saveAcceptDeclineLeagueInvite(
    leagueInvite: LeagueInvite,
    inviteResponse: InviteResponse,
    transaction: Transaction
  ) {
    let status: InviteStatus;
    if (inviteResponse === InviteResponse.Accept) {
      status = InviteStatus.Accepted;
    } else if (inviteResponse === InviteResponse.Decline) {
      status = InviteStatus.Declined;
    } else {
      throw new BadRequestError('Invalid invite response provided.');
    }

    for (const inviter of leagueInvite.getInviters()) {
      const leagueInviteAttributes: LeagueInviteAttributes = {
        id: inviter.inviteId,
        invitedProfileId: leagueInvite.getInvitedAccount().getProfileId(),
        inviterProfileId: inviter.inviterLeagueMember
          .getAccount()
          .getProfileId(),
        leagueId: leagueInvite.getLeague().getId(),
        status: status,
        message: 'This will be a message from the inviter.',
      };

      await this.leagueInviteRepository.saveLeagueInviteResponse(
        leagueInviteAttributes,
        transaction
      );
    }
  }

  async saveLeagueInvites(
    leagueInvites: Map<UUID, LeagueInvite>,
    transaction: Transaction
  ): Promise<void> {
    //for each league invite,
    for (const leagueInvite of leagueInvites.values()) {
      for (const inviter of leagueInvite.getInviters()) {
        const leagueInviteAttributes: LeagueInviteAttributes = {
          id: inviter.inviteId,
          invitedProfileId: leagueInvite.getInvitedAccount().getProfileId(),
          inviterProfileId: inviter.inviterLeagueMember
            .getAccount()
            .getProfileId(),
          leagueId: leagueInvite.getLeague().getId(),
          status: leagueInvite.getInviteStatus(),
          message: 'This will be a message from the inviter.',
        };
        await this.leagueInviteRepository.saveLeagueInvite(
          leagueInviteAttributes,
          transaction
        );
      }
    }
  }
}
