import { sequelize } from "../../config/db";
import logger from "../../config/logger";
import { LeagueAttributes } from "../../models/League";
import { InviteStatusEnum, LeagueProfileAttributes } from "../../models/LeagueProfile";
import leagueRepository from "../../repositories/leagueRepository";
import { LeagueInviteRequest, LeagueInviteResponse } from "../../types/league/leagueTypes";
import errorFactory from "../../utils/errors/errorFactory";
import profileService from "../profile/profileService";
import userService from "../user/userService";

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
        await leagueRepository.createLeagueProfile(profileId, league.leagueId, "LEAGUE_OWNER", InviteStatusEnum.Accepted, { transaction }
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
  inviteProfileToLeague: async (leagueInviteRequest: LeagueInviteRequest): Promise<LeagueInviteResponse> => {

    try {
      //Check league exists
      const leagueAttributes: LeagueAttributes | null = await leagueRepository.findLeagueByLeagueId(leagueInviteRequest.leagueId);
      if (!leagueAttributes) {
        return {
          statusCode: 404,
          message: `League with league id ${leagueInviteRequest.leagueId} not found`,
          success: false,
          error: "Not Found"
        }
      }

      //Check inviterProfile exists
      const inviterUserId: string | null = await userService.getUserIdByProfileId(leagueInviteRequest.inviterProfileId);
      if (!inviterUserId) {
        return {
          statusCode: 404,
          message: `Inviter Profile with profile id ${leagueInviteRequest.inviterProfileId} not found`,
          success: false,
          error: "Not Found"
        }
      }

      //Check inviterProfile is in league
      const isProfileInLeague: boolean = await leagueRepository.isProfileInLeague(leagueInviteRequest.inviterProfileId, leagueInviteRequest.leagueId);
      if (!isProfileInLeague) {
        return {
          statusCode: 401,
          message: `Inviter Profile with profile id ${leagueInviteRequest.inviterProfileId} is not in league with league id ${leagueInviteRequest.leagueId}`,
          success: false,
          error: "Unauthorized"
        }
      }

      if (leagueInviteRequest.inviteeProfileId === leagueInviteRequest.inviterProfileId) {
        return {
          statusCode: 400,
          message: `Inviter Profile with profile id ${leagueInviteRequest.inviterProfileId} cannot invite themselves to league with league id ${leagueInviteRequest.leagueId}`,
          success: false,
          error: "Bad Request"
        }
      }

      //Check inviteeProfile exists
      const inviteeUserId: string | null = await userService.getUserIdByProfileId(leagueInviteRequest.inviteeProfileId);
      if (!inviteeUserId) {
        return {
          statusCode: 404,
          message: `Invited Profile with profile id ${leagueInviteRequest.inviteeProfileId} not found`,
          success: false,
          error: "Not Found"
        }
      }

      //Check inviteeProfile is not in league already
      //Check inviteeProfile is not already invited to league
      let conflictMessage: string | undefined = undefined;
      const inviteeProfileInLeague: boolean = await leagueRepository.isProfileInLeague(leagueInviteRequest.inviteeProfileId, leagueInviteRequest.leagueId);
      if (inviteeProfileInLeague) {
        conflictMessage = `Invited Profile with profile id ${leagueInviteRequest.inviteeProfileId} is already in league with league id ${leagueInviteRequest.leagueId}`;
      }
      const inviteeProfileAlreadyInvited: boolean = await leagueRepository.isProfileInInvited(leagueInviteRequest.inviteeProfileId, leagueInviteRequest.leagueId);
      if (inviteeProfileAlreadyInvited) {
        conflictMessage = `Invited Profile with profile id ${leagueInviteRequest.inviteeProfileId} is already invited to league with league id ${leagueInviteRequest.leagueId}`;
      }
      if (conflictMessage) {
        return {
          statusCode: 409,
          message: conflictMessage,
          success: false,
          error: "Conflict"
        }
      }

      //Create a Sequelize transaction to commit after the database has been updated and the notification has been sent to the invited user.
      const transaction = await sequelize.transaction();
      //Create League Profile association for invitee
      const leagueProfile: LeagueProfileAttributes = await leagueRepository.createLeagueProfile(leagueInviteRequest.inviteeProfileId, leagueInviteRequest.leagueId, "LEAGUE_MEMBER", InviteStatusEnum.Pending, {});
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


    } catch (error) {
      console.error("Error inviting profile to league:", error);
      throw error;
    }
  }
}

export default leagueService;
