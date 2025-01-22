import { CreateOptions } from "sequelize";
import { models } from "../../config/db";
import { Account, LeagueMember, LeagueMemberRoleEnum } from "../../generated-api";
import { InviteStatusEnum, LeagueProfileAttributes } from "../../models/LeagueProfile";
import accountRepository from "../accountRepository";
import logger from "../../config/logger";

const leagueMemberRepository = {
    getLeagueMembersInLeague,
    createLeagueMember
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

async function createLeagueMember(leagueId: string, profileId: string, role: LeagueMemberRoleEnum, inviteStatus: InviteStatusEnum, options?: CreateOptions): Promise<LeagueMember | null> {
    const leagueProfileAttributes = await models.LeagueProfile.create({
        leagueId,
        profileId,
        role,
        inviteStatus,
        inviterProfileId: null
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