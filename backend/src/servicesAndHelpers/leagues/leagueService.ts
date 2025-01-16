import { sequelize } from "../../config/db";
import logger from "../../config/logger";
import { LeagueAttributes } from "../../models/League";
import { InviteStatusEnum, LeagueProfileAttributes } from "../../models/LeagueProfile";
import { ProfileAttributes } from "../../models/Profile";
import { UserAttributes } from "../../models/User";
import leagueRepository from "../../repositories/leagueRepository";
import profileRepository from "../../repositories/profileRepository";
import userRepository from "../../repositories/userRepository";
import { GetProfilesBySearchResponseData, League, LeagueInvite, LeagueInviteRequest, LeagueInviteResponse } from "../../types/league/leagueTypes";
import { Profile } from "../../types/profile/profileTypes";
import errorFactory from "../../utils/errors/errorFactory";
import profileService from "../profile/profileService";
import userService from "../user/userService";
import { checkInviteeConflict, validateInviteeProfile, validateInviterInLeague, validateInviterProfile, validateLeague } from "./leagueHelper";

const leagueService = {
  createLeague: async (
    seasonId: number,
    leagueName: string,
    profileId: string
  ): Promise<LeagueAttributes> => {
    const transaction = await sequelize.transaction();
    try {
      const league: LeagueAttributes = await leagueRepository.createLeague(seasonId, leagueName, { transaction });

      const leagueProfile: LeagueProfileAttributes =
        await leagueRepository.createLeagueProfile(profileId, league.leagueId, "LEAGUE_OWNER", InviteStatusEnum.Accepted, null, { transaction }
        );

      if (!leagueProfile) {
        throw errorFactory({
          statusCode: 400,
          error: "Unable to create LeagueProfile association",
        });
      }

      await transaction.commit();

      return league;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  getLeagueByLeagueId: async (leagueId: string): Promise<LeagueAttributes> => {
    const league: LeagueAttributes | null =
      await leagueRepository.findLeagueByLeagueId(leagueId);
    if (!league) {
      throw errorFactory({
        statusCode: 404,
        error: `Unable to find league with league id: ${leagueId}`,
      });
    }
    return league;
  },
  getLeaguesForProfile: async (
    profileId: string
  ): Promise<LeagueAttributes[]> => {
    try {
      const leagueProfileList: LeagueProfileAttributes[] =
        await leagueRepository.findLeagueProfileByProfileId(profileId);

      console.log(leagueProfileList);
      const leagues = await Promise.all(
        leagueProfileList.map(async (leagueProfile) => {
          const league = await leagueRepository.findLeagueByLeagueId(
            leagueProfile.leagueId
          );
          return league;
        })
      );

      return leagues.filter((league) => league !== null);
    } catch (error) {
      console.error("Error fetching leagues for profile:", error);
      throw new Error("Could not fetch leagues for profile");
    }
  },

  getLeagueInvitesForProfile: async (profileId: string): Promise<GetProfilesBySearchResponseData> => {
    const leagueProfileAttributesArray: LeagueProfileAttributes[] = await leagueRepository.getAllLeagueInvitesForProfile(profileId);
    if (!leagueProfileAttributesArray || leagueProfileAttributesArray.length === 0) {
      return {
        statusCode: 200,
        message: `No league invites found for profile with profile id ${profileId}`,
        error: undefined,
        leagueInvites: [],
        numLeagueInvites: 0
      }
    }

    const leagueInvites: LeagueInvite[] = [];

    for (let i = 0; i < leagueProfileAttributesArray.length; i++) {

      //Build league object
      const leagueAttributes: LeagueAttributes = await leagueService.getLeagueByLeagueId(leagueProfileAttributesArray[i].leagueId);
      const league: League = {
        leagueId: leagueAttributes.leagueId,
        name: leagueAttributes.name,
        season: leagueAttributes.seasonId
      }

      const inviterProfileId = leagueProfileAttributesArray[i].inviterProfileId;
      let message = '';
      let inviterProfile: Profile | null = null;
      if (!inviterProfileId) {
        inviterProfile = null;
        message = `You have been invited to join the league ${league.name}`;
      } else {
        const inviterProfileAttributes: ProfileAttributes = await profileRepository.getProfileRecordByProfileId(inviterProfileId);
        const inviterUserAttributes: UserAttributes = await userRepository.getUserByProfileId(inviterProfileId);
        const inviterProfile: Profile = {
          profileId: inviterProfileAttributes.profileId,
          userName: inviterUserAttributes.userName,
          firstName: inviterProfileAttributes.firstName || null,
          lastName: inviterProfileAttributes.lastName || null,
          profileImageUrl: inviterProfileAttributes.imageUrl || null
        }
        message = `${inviterProfileAttributes.firstName ? inviterProfileAttributes.firstName : inviterUserAttributes.userName} has invited you to join the league ${league.name}`;
      }

      leagueInvites.push({
        league: league,
        message: message,
        inviterProfile: inviterProfile
      });
    }

    return {
      statusCode: 200,
      message: `League invite${leagueInvites.length > 1 ? 's' : ''} found for profile with profile id ${profileId}`,
      error: undefined,
      leagueInvites: leagueInvites,
      numLeagueInvites: leagueInvites.length
    }

  },

  inviteProfileToLeague: async (leagueInviteRequest: LeagueInviteRequest): Promise<LeagueInviteResponse> => {

    try {
      await validateLeague(leagueInviteRequest.leagueId);
      await validateInviterProfile(leagueInviteRequest.inviterProfileId);
      await validateInviterInLeague(leagueInviteRequest.inviterProfileId, leagueInviteRequest.leagueId);

      if (leagueInviteRequest.inviteeProfileId === leagueInviteRequest.inviterProfileId) {
        return {
          statusCode: 400,
          message: `Inviter Profile with profile id ${leagueInviteRequest.inviterProfileId} cannot invite themselves to league with league id ${leagueInviteRequest.leagueId}`,
          success: false,
          error: "Bad Request"
        }
      }

      await validateInviteeProfile(leagueInviteRequest.inviteeProfileId);
      await checkInviteeConflict(leagueInviteRequest);

      //Create a Sequelize transaction to commit after the database has been updated and the notification has been sent to the invited user.
      const transaction = await sequelize.transaction();
      //Create League Profile association for invitee
      const leagueProfile: LeagueProfileAttributes = await leagueRepository.createLeagueProfile(leagueInviteRequest.inviteeProfileId, leagueInviteRequest.leagueId, "LEAGUE_MEMBER", InviteStatusEnum.Pending, leagueInviteRequest.inviterProfileId, {});
      if (!leagueProfile) {
        await transaction.rollback();
        logger.error("Could not create League Profile Association in Database whenever inviting profile to league");
        await transaction.rollback();
        return {
          statusCode: 500,
          message: "Internal Server Error",
          success: false,
          error: "Internal Server Error"
        }
      }

      await transaction.commit();

      return {
        statusCode: 200,
        message: `Invited Profile with profile id ${leagueInviteRequest.inviteeProfileId} invited successfully to league with league id ${leagueInviteRequest.leagueId}`,
        success: true
      }


    } catch (error: any) {
      console.error("Error inviting profile to league:", error);
      return {
        statusCode: error.statusCode || 500,
        message: error.message || 'An error occurred',
        success: false,
        error: error.error || 'Internal Server Error',
      };
    }
  }
};
export default leagueService;
