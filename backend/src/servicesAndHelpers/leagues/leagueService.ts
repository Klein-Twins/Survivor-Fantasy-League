import { UUID } from "crypto";
import { sequelize } from "../../config/db";
import logger from "../../config/logger";
import { LeagueAttributes } from "../../models/League";
import { InviteStatusEnum, LeagueProfileAttributes } from "../../models/LeagueProfile";
import { ProfileAttributes } from "../../models/Profile";
import { UserAttributes } from "../../models/User";
import leagueRepository from "../../repositories/leagueRepository";
import profileRepository from "../../repositories/profileRepository";
import userRepository from "../../repositories/userRepository";
import { APIResponse } from "../../types/api/apiResponseTypes";
import errorFactory from "../../utils/errors/errorFactory";
import { checkInviteeConflict, validateInviteeProfile, validateInviterInLeague, validateInviterProfile, validateLeague } from "./leagueHelper";
import leagueProfileRepository from "../../repositories/league/leagueProfileRepository";
import { CreateLeagueRequest, RespondToLeagueInviteRequest, RespondToLeagueInviteResponse } from "../../types/league/leagueDto";
import { League, LeagueMember } from "../../generated-api";
import leagueMemberRepository from "../../repositories/league/leagueMemberRepository";
import accountService from "../auth/accountService";

const leagueService = {
  createLeague,
  getLeaguesForProfileId
}

async function createLeague({ name, seasonId, profileId }: CreateLeagueRequest): Promise<League> {
  const transaction = await sequelize.transaction();
  logger.debug("New Transaction created for creating league");
  try {
    const league: League | null = await leagueRepository.createLeague(seasonId, name, profileId, { transaction });
    if (!league) {
      throw errorFactory({
        error: "Failed to create league. Please try again.",
        statusCode: 500,
      });
    }
    await transaction.commit();
    return league;


  } catch (error) {
    await transaction.rollback();
    logger.error("Transaction rolled back. Error creating league:", error);
    throw error;
  }
}

async function getLeaguesForProfileId(profileId: string, inviteStatus: InviteStatusEnum): Promise<League[]> {
  try {
    if (!await accountService.getAccountByProfileId(profileId)) {
      throw errorFactory({
        success: false,
        statusCode: 404,
        error: `Profile with profile id ${profileId} not found`
      });
    }

    const leagueIds: string[] = await leagueRepository.getLeagueIdsForProfileId(profileId, inviteStatus);
    const leagues: League[] = [];

    for (const leagueId of leagueIds) {
      const league: League | null = await leagueRepository.getLeagueByLeagueId(leagueId);
      if (league) {
        leagues.push(league);
      } else {
        logger.error(`Failed to get league with id ${leagueId}`);
      }
    }
    return leagues;

  } catch (error) {
    throw error;
  }
}


// const leagueService = {
//   createLeague: async (
//     seasonId: number,
//     leagueName: string,
//     profileId: string
//   ): Promise<LeagueAttributes> => {
//     const transaction = await sequelize.transaction();
//     try {
//       const league: LeagueAttributes = await leagueRepository.createLeague(seasonId, leagueName, { transaction });

//       const leagueProfile: LeagueProfileAttributes =
//         await leagueRepository.createLeagueProfile(profileId, league.leagueId, "LEAGUE_OWNER", InviteStatusEnum.Accepted, null, { transaction }
//         );

//       if (!leagueProfile) {
//         throw errorFactory({
//           statusCode: 400,
//           error: "Unable to create LeagueProfile association",
//         });
//       }

//       await transaction.commit();

//       return league;
//     } catch (error) {
//       await transaction.rollback();
//       throw error;
//     }
//   },
//   getLeagueByLeagueId: async (leagueId: string): Promise<LeagueAttributes> => {
//     const league: LeagueAttributes | null =
//       await leagueRepository.findLeagueByLeagueId(leagueId);
//     if (!league) {
//       throw errorFactory({
//         statusCode: 404,
//         error: `Unable to find league with league id: ${leagueId}`,
//       });
//     }
//     return league;
//   },
//   getLeaguesForProfile: async (
//     profileId: string
//   ): Promise<LeagueAttributes[]> => {
//     try {
//       const leagueProfileList: LeagueProfileAttributes[] =
//         await leagueRepository.findLeagueProfileByProfileId(profileId);

//       console.log(leagueProfileList);
//       const leagues = await Promise.all(
//         leagueProfileList.map(async (leagueProfile) => {
//           const league = await leagueRepository.findLeagueByLeagueId(
//             leagueProfile.leagueId
//           );
//           return league;
//         })
//       );

//       return leagues.filter((league) => league !== null);
//     } catch (error) {
//       console.error("Error fetching leagues for profile:", error);
//       throw new Error("Could not fetch leagues for profile");
//     }
//   },

//   getLeagueInvitesForProfile: async (profileId: string): Promise<GetProfilesBySearchResponseData> => {
//     const leagueProfileAttributesArray: LeagueProfileAttributes[] = await leagueRepository.getAllLeagueInvitesForProfile(profileId);
//     if (!leagueProfileAttributesArray || leagueProfileAttributesArray.length === 0) {
//       return {
//         statusCode: 200,
//         message: `No league invites found for profile with profile id ${profileId}`,
//         error: undefined,
//         leagueInvites: [],
//         numLeagueInvites: 0
//       }
//     }

//     const leagueInvites: LeagueInvite[] = [];

//     for (let i = 0; i < leagueProfileAttributesArray.length; i++) {

//       //Build league object
//       const leagueAttributes: LeagueAttributes = await leagueService.getLeagueByLeagueId(leagueProfileAttributesArray[i].leagueId);
//       const league: League = {
//         leagueId: leagueAttributes.leagueId,
//         name: leagueAttributes.name,
//         season: leagueAttributes.seasonId
//       }

//       const inviterProfileId = leagueProfileAttributesArray[i].inviterProfileId;
//       let message = '';
//       let inviterProfile: Profile | null = null;
//       if (!inviterProfileId) {
//         inviterProfile = null;
//         message = `You have been invited to join the league ${league.name}`;
//       } else {
//         const inviterProfileAttributes: ProfileAttributes = await profileRepository.getProfileRecordByProfileId(inviterProfileId);
//         const inviterUserAttributes: UserAttributes | null = await userRepository.getUserByProfileId(inviterProfileId);

//         if (!inviterUserAttributes) {
//           throw errorFactory({ error: `User not found for profile with profile id ${inviterProfileId}`, statusCode: 404 });
//         }
//         const inviterProfile: Profile = {
//           profileId: inviterProfileAttributes.profileId,
//           userName: inviterUserAttributes.userName,
//           firstName: inviterProfileAttributes.firstName || null,
//           lastName: inviterProfileAttributes.lastName || null,
//           profileImageUrl: inviterProfileAttributes.imageUrl || null
//         }
//         message = `${inviterProfileAttributes.firstName ? inviterProfileAttributes.firstName : inviterUserAttributes.userName} has invited you to join the league ${league.name}`;
//       }

//       leagueInvites.push({
//         league: league,
//         message: message,
//         inviterProfile: inviterProfile
//       });
//     }

//     return {
//       statusCode: 200,
//       message: `League invite${leagueInvites.length > 1 ? 's' : ''} found for profile with profile id ${profileId}`,
//       error: undefined,
//       leagueInvites: leagueInvites,
//       numLeagueInvites: leagueInvites.length
//     }

//   },

//   inviteProfileToLeague: async (leagueInviteRequest: LeagueInviteRequest): Promise<APIResponse> => {

//     try {
//       await validateLeague(leagueInviteRequest.leagueId);
//       await validateInviterProfile(leagueInviteRequest.inviterProfileId);
//       await validateInviterInLeague(leagueInviteRequest.inviterProfileId, leagueInviteRequest.leagueId);

//       if (leagueInviteRequest.inviteeProfileId === leagueInviteRequest.inviterProfileId) {
//         return {
//           statusCode: 400,
//           message: `Inviter Profile with profile id ${leagueInviteRequest.inviterProfileId} cannot invite themselves to league with league id ${leagueInviteRequest.leagueId}`,
//           success: false,
//           error: "Bad Request"
//         }
//       }

//       await validateInviteeProfile(leagueInviteRequest.inviteeProfileId);
//       await checkInviteeConflict(leagueInviteRequest);

//       //Create a Sequelize transaction to commit after the database has been updated and the notification has been sent to the invited user.
//       const transaction = await sequelize.transaction();
//       //Create League Profile association for invitee
//       const leagueProfile: LeagueProfileAttributes = await leagueRepository.createLeagueProfile(leagueInviteRequest.inviteeProfileId, leagueInviteRequest.leagueId, "LEAGUE_MEMBER", InviteStatusEnum.Pending, leagueInviteRequest.inviterProfileId, {});
//       if (!leagueProfile) {
//         await transaction.rollback();
//         logger.error("Could not create League Profile Association in Database whenever inviting profile to league");
//         await transaction.rollback();
//         return {
//           statusCode: 500,
//           message: "Internal Server Error",
//           success: false,
//           error: "Internal Server Error"
//         }
//       }

//       await transaction.commit();

//       return {
//         statusCode: 200,
//         message: `Invited Profile with profile id ${leagueInviteRequest.inviteeProfileId} invited successfully to league with league id ${leagueInviteRequest.leagueId}`,
//         success: true
//       }


//     } catch (error: any) {
//       console.error("Error inviting profile to league:", error);
//       return {
//         statusCode: error.statusCode || 500,
//         message: error.message || 'An error occurred',
//         success: false,
//         error: error.error || 'Internal Server Error',
//       };
//     }
//   },

//   respondToLeagueInvite: async ({ leagueId, inviteResponse }: RespondToLeagueInviteRequest, profileId: string): Promise<RespondToLeagueInviteResponse> => {

//     //Check if the profile exists
//     const profileAttributes: ProfileAttributes = await profileRepository.getProfileRecordByProfileId(profileId);
//     if (!profileAttributes) {
//       throw errorFactory({ error: 'Not Found: Profile not found', statusCode: 404 });
//     }
//     //Check if the league exists
//     const leagueAttributes: LeagueAttributes | null = await leagueRepository.findLeagueByLeagueId(leagueId);
//     if (!leagueAttributes) {
//       throw errorFactory({ error: 'Not Found: League not found', statusCode: 404 })
//     };

//     //Check if the league profile association exists with a pending invite
//     const leagueProfileAttributes: LeagueProfileAttributes | null = await leagueRepository.getLeagueProfileAssociation(profileId, leagueId, InviteStatusEnum.Pending);
//     if (!leagueProfileAttributes) {
//       throw errorFactory({ error: 'Unauthorized: Profile was not invited to league', statusCode: 401 });
//     }


//     //If the response is ACCEPT, update the league profile association to accepted
//     if (inviteResponse === RespondLeagueInvite.Accept) {
//       const updatedLeagueProfile = await leagueProfileRepository.respondToLeagueInvite(leagueId, profileId, inviteResponse);
//       if (!updatedLeagueProfile) {
//         throw errorFactory({ error: 'Internal Server Error: Unable to update league profile association', statusCode: 500 });
//       }
//       return {
//         success: true,
//         statusCode: 200,
//         message: `Profile with profile id ${profileId} has accepted the invitation to join league with league id ${leagueId}`,
//       }
//     }

//     //If the response is DECLINE, delete the league profile association
//     if (inviteResponse === RespondLeagueInvite.Decline) {
//       const deletedLeagueProfile = await leagueProfileRepository.respondToLeagueInvite(leagueId, profileId, inviteResponse);
//       if (!deletedLeagueProfile) {
//         throw errorFactory({ error: 'Internal Server Error: Unable to delete league profile association', statusCode: 500 });
//       }
//       return {
//         success: true,
//         statusCode: 200,
//         message: `Profile with profile id ${profileId} has declined the invitation to join league with league id ${leagueId}`,
//       }
//     }

//     throw errorFactory({ error: 'Bad Request: Invalid inviteResponse Status - must be ACCEPT or DECLINE', statusCode: 400 });
//   }
// };
export default leagueService;
