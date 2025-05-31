import { Request, Response, NextFunction } from 'express';
import {
  GetLeagueInvitesResponse,
  GetLeagueInvitesResponseData,
  InviteResponse,
  RespondToLeagueInviteRequestBody,
  RespondToLeagueInviteResponse,
  RespondToLeagueInviteResponseData,
} from '../../generated-api';
import { UUID } from 'crypto';
import validator from 'validator';
import { BadRequestError } from '../../utils/errors/errors';

const leagueInviteController = {
  getLeagueInvitesForProfileId,
  createAndSendLeagueInvite,
  respondToLeagueInvite,
};

async function getLeagueInvitesForProfileId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const profileId = req.query.profileId as string;
    const seasonId = req.query.seasonId as string;
    if (!profileId) {
      throw new BadRequestError('Missing profile ID');
    }
    if (!validator.isUUID(profileId)) {
      throw new BadRequestError('Invalid Profile ID');
    }
    if (!seasonId) {
      throw new BadRequestError('Missing season ID');
    }
    if (!validator.isNumeric(seasonId)) {
      throw new BadRequestError('Invalid Season ID');
    }

    const leagueInvites =
      await leagueInviteService.getLeagueInvitesForProfileId(
        profileId as UUID,
        parseInt(seasonId)
      );

    const responseData: GetLeagueInvitesResponseData = {
      numLeagueInvites: leagueInvites.length,
      leagueInvites,
    };

    const response: GetLeagueInvitesResponse = {
      success: true,
      message: `${responseData.numLeagueInvites} league invites retrieved successfully`,
      responseData,
      statusCode: 200,
    };

    res.status(200).json(response);
    return;
  } catch (error) {
    next(error);
  }
}

async function createAndSendLeagueInvite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { leagueId, inviterProfileId, invitedProfileId } = req.body;
    if (!leagueId) {
      throw new BadRequestError('Missing league ID');
    }
    if (!validator.isUUID(leagueId)) {
      throw new BadRequestError('Invalid League ID');
    }
    if (!inviterProfileId) {
      throw new BadRequestError('Missing inviter profile ID');
    }
    if (!validator.isUUID(inviterProfileId)) {
      throw new BadRequestError('Invalid Inviter Profile ID');
    }
    if (!invitedProfileId) {
      throw new BadRequestError('Missing invited profile ID');
    }
    if (!validator.isUUID(invitedProfileId)) {
      throw new BadRequestError('Invalid Invited Profile ID');
    }

    await leagueInviteService.createAndSendLeagueInvite({
      leagueId: leagueId as UUID,
      inviterProfileId: inviterProfileId as UUID,
      invitedProfileId: invitedProfileId as UUID,
    });
    res.status(200).json('League invite created successfully');
  } catch (error) {
    next(error);
  }
}

async function respondToLeagueInvite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      leagueId,
      inviteResponse,
      inviteId,
    }: RespondToLeagueInviteRequestBody = req.body;
    const profileId = req.query.profileId as string;
    const seasonId = req.query.seasonId as string;
    if (!leagueId) {
      throw new BadRequestError('Missing league ID');
    }
    if (!validator.isUUID(leagueId)) {
      throw new BadRequestError('Invalid League ID');
    }
    if (!profileId) {
      throw new BadRequestError('Missing profile ID');
    }
    if (!validator.isUUID(profileId)) {
      throw new BadRequestError('Invalid Profile ID');
    }
    if (!inviteResponse) {
      throw new BadRequestError('Missing invite response');
    }
    if (
      inviteResponse !== InviteResponse.Accept &&
      inviteResponse !== InviteResponse.Decline
    ) {
      throw new BadRequestError('Invalid invite response');
    }
    if (!inviteId) {
      throw new BadRequestError('Missing invite ID');
    }
    if (!validator.isUUID(inviteId)) {
      throw new BadRequestError('Invalid Invite ID');
    }

    const league = await leagueInviteService.respondToLeagueInvite({
      leagueId: leagueId as UUID,
      profileId: profileId as UUID,
      inviteResponse: inviteResponse as InviteResponse,
    });

    const respondToLeagueInviteResponseData: RespondToLeagueInviteResponseData =
      {
        league: inviteResponse === InviteResponse.Accept ? league : undefined,
        inviteId,
        inviteResponse,
      };

    const response: RespondToLeagueInviteResponse = {
      success: true,
      message: `Successfully ${
        inviteResponse === InviteResponse.Accept ? 'accepted' : 'declined'
      } league invite for league ${league.name}`,
      responseData: respondToLeagueInviteResponseData,
      statusCode: 200,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export default leagueInviteController;
