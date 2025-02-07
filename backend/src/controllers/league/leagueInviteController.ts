import { Request, Response, NextFunction } from 'express';
import {
  GetLeagueInvitesForPlayerResponse,
  GetLeagueInvitesForPlayerResponseData,
  RespondToLeagueInviteRequestBody,
} from '../../generated-api';
import leagueInviteService from '../../services/league/leagueInviteService';

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
    const responseData: GetLeagueInvitesForPlayerResponseData =
      await leagueInviteService.getLeagueInvitesForProfileId(profileId);
    const response: GetLeagueInvitesForPlayerResponse = {
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
    await leagueInviteService.createAndSendLeagueInvite(
      leagueId,
      inviterProfileId,
      invitedProfileId
    );
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
    await leagueInviteService.respondToLeagueInvite(req.body);
    res.status(200).json('League invite response updated successfully');
  } catch (error) {
    next(error);
  }
}

export default leagueInviteController;
