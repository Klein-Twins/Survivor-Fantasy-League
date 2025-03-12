import { Transaction } from 'sequelize';
import { League, LeagueMember, Season } from '../../generated-api';
import { models, sequelize } from '../../config/db';
import { v4 as uuidv4 } from 'uuid';
import { LeagueAttributes } from '../../models/league/League';
import leagueMemberService from '../../services/league/leagueMemberService';
import leagueService from '../../services/league/leagueService';
import { NotFoundError } from '../../utils/errors/errors';
import {
  InviteStatusEnum,
  LeagueProfileAttributes,
} from '../../models/league/LeagueProfile';
import leagueHelper from '../../helpers/league/leagueHelper';
import { ProfileAttributes } from '../../models/account/Profile';
import { SeasonsAttributes } from '../../models/season/Seasons';

const leagueRepository = {
  createLeague,
  getLeague,
  getLeagueByLeagueProfileId,
  getLeaguesForProfile,
};

async function getLeagueByLeagueProfileId(
  leagueProfileId: LeagueProfileAttributes['id']
): Promise<League> {
  const leagueProfileAttributes: LeagueProfileAttributes | null =
    await models.LeagueProfile.findOne({
      where: {
        id: leagueProfileId,
      },
    });

  if (!leagueProfileAttributes) {
    throw new NotFoundError(`League Profile Id Not Foun ${leagueProfileId}`);
  }

  return await leagueService.getLeague(leagueProfileAttributes.leagueId);
}

async function getLeaguesForProfile(
  profileId: ProfileAttributes['profileId'],
  inviteStatus: InviteStatusEnum
): Promise<League[]> {
  const leagueProfileAttributes: LeagueProfileAttributes[] =
    await models.LeagueProfile.findAll({
      where: {
        profileId,
        inviteStatus,
      },
    });

  if (leagueProfileAttributes.length === 0) {
    return [];
  }

  const leagueIds: LeagueProfileAttributes['leagueId'][] =
    leagueProfileAttributes.map(
      (leagueProfileAttribute) => leagueProfileAttribute.leagueId
    );

  const leagues: League[] = await Promise.all(
    leagueIds.map((leagueId) => leagueService.getLeague(leagueId))
  );
  return leagues;
}

async function getLeague(
  leagueId: LeagueAttributes['leagueId'],
  transaction?: Transaction
): Promise<League> {
  const leagueAttributes: LeagueAttributes | null = await models.League.findOne(
    {
      where: {
        leagueId: leagueId,
      },
      transaction,
    }
  );

  if (!leagueAttributes) {
    throw new NotFoundError(`League not found for leagueId: ${leagueId}`);
  }

  return await leagueHelper.buildLeague(leagueAttributes);
}

async function createLeague(
  seasonId: SeasonsAttributes['seasonId'],
  name: SeasonsAttributes['name'],
  profileId: ProfileAttributes['profileId'],
  transaction?: Transaction
): Promise<League> {
  let t = transaction;
  if (!transaction) {
    t = await sequelize.transaction();
  }
  try {
    const leagueAttributes: LeagueAttributes = await models.League.create(
      {
        leagueId: uuidv4(),
        seasonId: seasonId,
        name: name,
      },
      { transaction: t }
    );

    const leagueOwner: LeagueMember =
      await leagueMemberService.createLeagueOwner(
        leagueAttributes.leagueId,
        profileId,
        t
      );

    if (!transaction && t) {
      await t.commit();
    }
    return leagueHelper.buildLeague(leagueAttributes);
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

export default leagueRepository;
