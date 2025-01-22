import { CreateOptions, InstanceUpdateOptions, UpdateOptions } from "sequelize";
import { models } from "../../config/db";
import { Account, League, LeagueInvite, LeagueMember, LeagueMemberRoleEnum, Profile, RespondToLeagueInviteRequestBodyInviteResponseEnum } from "../../generated-api";
import { InviteStatusEnum, LeagueProfileAttributes } from "../../models/LeagueProfile";
import accountRepository from "../accountRepository";
import logger from "../../config/logger";
import leagueRepository from "../leagueRepository";
import profileService from "../../servicesAndHelpers/profile/profileService";
import userService from "../../servicesAndHelpers/user/userService";
import profileRepository from "../profileRepository";

const leagueMemberRepository = {
    getLeagueMembersInLeague,
    createLeagueMember,
    isUserInLeague,
    isUserInvitedToLeague,
    getLeagueInvitesForProfileId,
    respondToLeagueInvite,
}

async function respondToLeagueInvite(leagueId: string, profileId: string, inviteResponse: RespondToLeagueInviteRequestBodyInviteResponseEnum, options?: InstanceUpdateOptions<LeagueProfileAttributes>): Promise<League | null> {
    const leagueProfile = await models.LeagueProfile.findOne({
        where: {
            leagueId,
            profileId,
            inviteStatus: InviteStatusEnum.Pending
        }
    });

    if (!leagueProfile) {
        logger.error(`No pending league invite found for profile ${profileId} in league ${leagueId}`);
        return null;
    }

    if (inviteResponse === RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT) {
        await leagueProfile.set('inviteStatus', InviteStatusEnum.Accepted);
        await leagueProfile.save(options);
    } else {
        await leagueProfile.destroy(options);
        return null;
    }

    return await leagueRepository.getLeagueByLeagueId(leagueId);
}


async function getLeagueInvitesForProfileId(profileId: string): Promise<LeagueInvite[]> {
    const leagueInviteProfiles = await models.LeagueProfile.findAll({
        where: {
            profileId,
            inviteStatus: InviteStatusEnum.Pending
        }
    });

    if (!leagueInviteProfiles || leagueInviteProfiles.length === 0) {
        return [];
    }

    const leagueInvites: LeagueInvite[] = [];

    for (const leagueInviteProfile of leagueInviteProfiles) {
        const league: League | null = await leagueRepository.getLeagueByLeagueId(leagueInviteProfile.leagueId);
        if (!league || !leagueInviteProfile.inviterProfileId) {
            continue;
        }
        const inviterProfile: Profile | null = await profileRepository.getProfileByProfileId(leagueInviteProfile.inviterProfileId);
        if (!inviterProfile) {
            continue;
        }
        const message = `${inviterProfile.userName} has invited you to join a league`;
        leagueInvites.push({
            league,
            message,
            inviterProfile
        });
    }
    return leagueInvites;

}

async function isUserInLeague(leagueId: string, profileId: string): Promise<boolean> {
    const leagueProfile = await models.LeagueProfile.findOne({
        where: {
            leagueId,
            profileId,
            inviteStatus: InviteStatusEnum.Accepted
        }
    });
    return !!leagueProfile;
}
async function isUserInvitedToLeague(leagueId: string, profileId: string): Promise<boolean> {
    const leagueProfile = await models.LeagueProfile.findOne({
        where: {
            leagueId,
            profileId,
            inviteStatus: InviteStatusEnum.Pending
        }
    });
    return !!leagueProfile;
}


async function getLeagueMembersInLeague(leagueId: string): Promise<LeagueMember[]> {
    const leagueProfiles: LeagueProfileAttributes[] = await models.LeagueProfile.findAll({
        where: {
            leagueId
        }
    });
    if (!leagueProfiles || leagueProfiles.length === 0) {
        return [];
    }

    const accountPromises = leagueProfiles.map(profile =>
        accountRepository.getAccountByProfileId(profile.profileId)
    );

    const accounts = await Promise.all(accountPromises);
    const leagueMembers: LeagueMember[] = leagueProfiles
        .filter((_, index) => accounts[index] !== null)
        .map((profile, index): LeagueMember => ({
            role: profile.role as LeagueMemberRoleEnum,
            account: accounts[index]!
        }));
    return leagueMembers;
}

async function createLeagueMember(leagueId: string, profileId: string, inviterProfileId: string | null = null, role: LeagueMemberRoleEnum, inviteStatus: InviteStatusEnum, options?: CreateOptions): Promise<LeagueMember | null> {
    const leagueProfileAttributes = await models.LeagueProfile.create({
        leagueId,
        profileId,
        role,
        inviteStatus,
        inviterProfileId
    }, options);

    if (!leagueProfileAttributes) {
        logger.error(`Failed to create league profile for profile ${profileId} in league ${leagueId}`);
        return null;
    }

    const leagueMemberAccount = await accountRepository.getAccountByProfileId(profileId);
    if (!leagueMemberAccount) {
        logger.error(`Failed to find account for profile ${profileId}`);
        return null;
    }
    return {
        role,
        account: leagueMemberAccount
    };
}

export default leagueMemberRepository;