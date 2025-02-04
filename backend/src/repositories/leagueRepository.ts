import { v4 as uuidv4 } from 'uuid';
import { CreateOptions, Transaction, UUID, UUIDV4 } from 'sequelize';
import { models, sequelize } from '../config/db';
import { LeagueAttributes } from '../models/league/League';
import { InviteStatusEnum, LeagueProfileAttributes } from '../models/league/LeagueProfile';
import { League, LeagueMember, LeagueMemberRoleEnum, Season } from '../generated-api';
import seasonRepository from './seasonRepository';
import { SeasonsAttributes } from '../models/season/Seasons';
import leagueMemberRepository from './league/leagueMemberRepository';
import logger from '../config/logger';
import seasonService from '../servicesAndHelpers/season/seasonService';
import leagueService from '../servicesAndHelpers/leagues/leagueService';

function buildLeagueObject(leagueData: LeagueAttributes, season: Season, leagueMembers: LeagueMember[]): League {
  return {
    leagueId: leagueData.leagueId,
    name: leagueData.name,
    season,
    leagueMembers,
  };
}

const leagueRepository = {
  createLeague,
  getLeagueByLeagueId,
  getLeagueIdsForProfileId,
};

async function createLeague(
  seasonId: number,
  name: string,
  profileId: string,
  options: CreateOptions
): Promise<League | null> {
  const season: Season | null = await seasonRepository.getSeasonBySeasonId(seasonId);
  if (!season) {
    logger.error(`Season with id ${seasonId} not found`);
    return null;
  }
  const leagueAttributes: LeagueAttributes = await models.League.create(
    {
      leagueId: uuidv4(),
      seasonId: seasonId,
      name: name,
    },
    options
  );

  const leagueOwner: LeagueMember | null = await leagueMemberRepository.createLeagueMember(
    leagueAttributes.leagueId,
    profileId,
    null,
    LeagueMemberRoleEnum.OWNER,
    InviteStatusEnum.Accepted,
    options
  );
  if (!leagueOwner) {
    logger.error(`Failed to create league member for profile ${profileId}`);
    return null;
  }

  const leagueMembers: LeagueMember[] = [leagueOwner];
  return buildLeagueObject(leagueAttributes, season, leagueMembers);
}

async function getLeagueByLeagueId(leagueId: string): Promise<League | null> {
  const leagueAttributes: LeagueAttributes | null = await models.League.findOne({
    where: {
      leagueId,
    },
  });
  if (!leagueAttributes) {
    return null;
  }
  const season: Season | null = await seasonRepository.getSeasonBySeasonId(leagueAttributes.seasonId);
  if (!season) {
    return null;
  }

  const leagueMembers: LeagueMember[] = await leagueMemberRepository.getLeagueMembersInLeague(leagueId);
  return buildLeagueObject(leagueAttributes, season, leagueMembers);
}

async function getLeagueIdsForProfileId(profileId: string, inviteStatus: InviteStatusEnum): Promise<string[]> {
  const leagueProfileAttributes = await models.LeagueProfile.findAll({
    where: {
      profileId,
      inviteStatus,
    },
  });

  if (!leagueProfileAttributes || leagueProfileAttributes.length === 0) {
    return [];
  }

  return leagueProfileAttributes.map((leagueProfile) => leagueProfile.leagueId);
}

// const leagueRepository = {
//     createLeague: async (seasonId: number, name: string, options: CreateOptions): Promise<League | null> => {
//         const leagueAttribute: LeagueAttributes = await models.League.create({
//             seasonId: seasonId,
//             name: name
//         }, options);

//     },
//     findLeagueByLeagueId: async (leagueId: string): Promise<LeagueAttributes | null> => {
//         return await models.League.findByPk(leagueId, {
//             include: [{
//                 model: models.Seasons,
//                 as: 'season'
//             }]
//         })
//     },
//     createLeagueProfile: async (profileId: string, leagueId: string, role: string, inviteStatus: InviteStatusEnum, inviterProfileId: string | null, options?: CreateOptions): Promise<LeagueProfileAttributes> => {
//         return await models.LeagueProfile.create({
//             leagueId: leagueId,
//             profileId: profileId,
//             role: role,
//             inviteStatus: inviteStatus,
//             inviterProfileId: inviterProfileId
//         }, options)

//     },
//     findLeagueProfileByProfileId: async (profileId: string): Promise<LeagueProfileAttributes[]> => {
//         return await models.LeagueProfile.findAll({
//             where: {
//                 profileId: profileId,
//                 inviteStatus: InviteStatusEnum.Accepted
//             }
//         })
//     },
//     isProfileInLeague: async (profileId: string, leagueId: string): Promise<boolean> => {
//         const inDatabase = await models.LeagueProfile.findOne({
//             where: {
//                 profileId: profileId,
//                 leagueId: leagueId,
//                 inviteStatus: InviteStatusEnum.Accepted
//             }
//         })
//         return inDatabase !== undefined && inDatabase !== null;
//     },
//     getAllLeagueInvitesForProfile: async (profileId: string): Promise<LeagueProfileAttributes[]> => {
//         return await models.LeagueProfile.findAll({
//             where: {
//                 profileId: profileId,
//                 inviteStatus: InviteStatusEnum.Pending
//             }
//         })
//     },

//     isProfileInInvited: async (profileId: string, leagueId: string): Promise<boolean> => {
//         const inDatabase = await models.LeagueProfile.findOne({
//             where: {
//                 profileId: profileId,
//                 leagueId: leagueId,
//                 inviteStatus: InviteStatusEnum.Pending
//             }
//         })
//         return inDatabase !== undefined && inDatabase !== null;
//     },
//     getLeagueProfileAssociation: async (profileId: string, leagueId: string, inviteStatus: InviteStatusEnum): Promise<LeagueProfileAttributes | null> => {
//         return await models.LeagueProfile.findOne({
//             where: {
//                 profileId: profileId,
//                 leagueId: leagueId,
//                 inviteStatus: inviteStatus
//             }
//         })
//     }
// };

export default leagueRepository;
