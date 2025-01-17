import { CreateOptions, Transaction } from "sequelize";
import { models, sequelize } from "../config/db";
import { LeagueAttributes } from "../models/League";
import { InviteStatusEnum, LeagueProfileAttributes } from "../models/LeagueProfile";

const leagueRepository = {
    createLeague: async (seasonId: number, name: string, options: CreateOptions): Promise<LeagueAttributes> => {
        return await models.League.create({
            seasonId: seasonId,
            name: name
        }, options)
    },
    findLeagueByLeagueId: async (leagueId: string): Promise<LeagueAttributes | null> => {
        return await models.League.findByPk(leagueId, {
            include: [{
                model: models.Seasons,
                as: 'season'
            }]
        })
    },
    createLeagueProfile: async (profileId: string, leagueId: string, role: string, inviteStatus: InviteStatusEnum, inviterProfileId: string | null, options?: CreateOptions): Promise<LeagueProfileAttributes> => {
        return await models.LeagueProfile.create({
            leagueId: leagueId,
            profileId: profileId,
            role: role,
            inviteStatus: inviteStatus,
            inviterProfileId: inviterProfileId
        }, options)

    },
    findLeagueProfileByProfileId: async (profileId: string): Promise<LeagueProfileAttributes[]> => {
        return await models.LeagueProfile.findAll({
            where: {
                profileId: profileId,
                inviteStatus: InviteStatusEnum.Accepted
            }
        })
    },
    isProfileInLeague: async (profileId: string, leagueId: string): Promise<boolean> => {
        const inDatabase = await models.LeagueProfile.findOne({
            where: {
                profileId: profileId,
                leagueId: leagueId,
                inviteStatus: InviteStatusEnum.Accepted
            }
        })
        return inDatabase !== undefined && inDatabase !== null;
    },
    getAllLeagueInvitesForProfile: async (profileId: string): Promise<LeagueProfileAttributes[]> => {
        return await models.LeagueProfile.findAll({
            where: {
                profileId: profileId,
                inviteStatus: InviteStatusEnum.Pending
            }
        })
    },

    isProfileInInvited: async (profileId: string, leagueId: string): Promise<boolean> => {
        const inDatabase = await models.LeagueProfile.findOne({
            where: {
                profileId: profileId,
                leagueId: leagueId,
                inviteStatus: InviteStatusEnum.Pending
            }
        })
        return inDatabase !== undefined && inDatabase !== null;
    }
};

export default leagueRepository;