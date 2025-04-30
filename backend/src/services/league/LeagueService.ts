import { inject, injectable, singleton } from 'tsyringe';
import { Account } from '../../domain/account/Account';
import { League } from '../../domain/league/League';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueAttributes } from '../../models/league/League';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { AccountService } from '../account/AccountService';
import { LeagueMemberService } from './LeagueMemberService';
import sequelize from '../../config/db';
import { LeagueRepository } from '../../repositories/league/LeagueRepository';
import { NotFoundError } from '../../utils/errors/errors';
import { LeagueMember, LeagueOwner } from '../../domain/league/LeagueMember';
import { LeagueMemberRole } from '../../generated-api';
import { LeagueInviteService } from './invite/LeagueInviteService';
import { UUID } from 'crypto';
import { LeagueInvite } from '../../domain/league/invite/LeagueInvite';
import logger from '../../config/logger';
import { CACHE_ENABLED } from '../../config/config';

@singleton()
export class LeagueStorage {
  private leagues: Map<LeagueAttributes['leagueId'], League>;

  constructor() {
    this.leagues = new Map<LeagueAttributes['leagueId'], League>();
  }

  getLeague(leagueId: LeagueAttributes['leagueId']): League | undefined {
    return this.leagues.get(leagueId);
  }

  setLeague(league: League): void {
    this.leagues.set(league.getId(), league);
  }
}

@injectable()
export class LeagueService {
  constructor(
    @inject(LeagueStorage) private leagueStorage: LeagueStorage,
    @inject(AccountService) private accountService: AccountService,
    @inject(LeagueInviteService)
    private leagueInviteService: LeagueInviteService,
    @inject(LeagueMemberService)
    private leagueMemberService: LeagueMemberService
  ) {}

  async fetchLeagues({
    profileId,
    seasonId,
  }: {
    profileId: ProfileAttributes['profileId'];
    seasonId: SeasonsAttributes['seasonId'];
  }): Promise<League[]> {
    const account: Account = await this.accountService.fetchAccount(
      'profileId',
      profileId
    );

    const leagueIds: League['id'][] =
      await LeagueRepository.getLeagueIdsProfileIdIsEnrolledIn(
        profileId,
        seasonId
      );

    const leagues: League[] = [];
    for (const leagueId of leagueIds) {
      const league: League = await this.fetchLeague(leagueId);
      if (league.getSeasonId() === seasonId) {
        leagues.push(league);
      }
    }

    return leagues;
  }

  async fetchLeague(leagueId: LeagueAttributes['leagueId']): Promise<League> {
    if (CACHE_ENABLED) {
      const cachedLeague = this.leagueStorage.getLeague(leagueId);
      if (cachedLeague) {
        logger.debug(`League ${leagueId} found in cache`);
        return cachedLeague;
      }
      logger.debug(`League ${leagueId} not found in cache, fetching from DB`);
    } else {
      logger.debug(`Cache is disabled, fetching league from DB`);
    }

    const leagueData: LeagueAttributes | null =
      await LeagueRepository.getLeagueById(leagueId);
    if (!leagueData) {
      throw new NotFoundError('League not found');
    }

    const league: League = new League({
      id: leagueData.leagueId,
      seasonId: leagueData.seasonId,
      name: leagueData.name,
    });

    const leagueMembers: LeagueMember[] =
      await this.leagueMemberService.fetchLeagueMembers(league);

    for (const leagueMember of leagueMembers) {
      if (leagueMember.getRole() === LeagueMemberRole.Owner) {
        league.addLeagueOwner(leagueMember as LeagueOwner);
      } else {
        league.addLeagueMember(leagueMember);
      }
    }

    const leagueInvites: Map<UUID, LeagueInvite> =
      await this.leagueInviteService.fetchLeagueInvitesForLeague(league);
    league.setLeagueInvites(leagueInvites);

    this.leagueStorage.setLeague(league);
    logger.debug(`League ${leagueId} cached successfully`);

    return league;
  }

  async createLeague({
    profileId,
    seasonId,
    name,
  }: {
    profileId: ProfileAttributes['profileId'];
    seasonId: SeasonsAttributes['seasonId'];
    name: LeagueAttributes['name'];
  }): Promise<League> {
    const league = new League({
      seasonId,
      name,
    });

    const account: Account = await this.accountService.fetchAccount(
      'profileId',
      profileId
    );

    const leagueOwner = this.leagueMemberService.createLeagueOwner({
      account,
      league,
    });

    league.addLeagueOwner(leagueOwner);

    await this.saveLeague(league);

    return league;
  }

  async saveLeague(league: League): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      await LeagueRepository.saveLeagueAttributes(
        {
          leagueId: league.getId(),
          seasonId: league.getSeasonId(),
          name: league.getName(),
        },
        transaction
      );

      for (const leagueMember of league.getLeagueMembers()) {
        await this.leagueMemberService.saveLeagueMember(
          leagueMember,
          transaction
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
