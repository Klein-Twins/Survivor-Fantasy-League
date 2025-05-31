import { NextFunction, Request, Response } from 'express';
import { NotImplementedError } from '../../../utils/errors/errors';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { ProfileAttributes } from '../../../models/account/Profile';
import leagueInviteControllerHelper from './leagueInviteControllerHelper';
import { LeagueInviteService } from '../../../services/league/invite/LeagueInviteService';
import { LeagueInvite } from '../../../domain/league/invite/LeagueInvite';
import {
  CreateAndSendLeagueInviteResponse,
  GetLeagueInvitesResponse,
  InviteResponse,
  RespondToLeagueInviteResponse,
} from '../../../generated-api';
import { container } from 'tsyringe';

const leagueInviteController = {
  getLeagueInvites,
  sendLeagueInvite,
  respondToLeagueInvite,
};

export type GetLeagueInvitesRequestParams = {
  profileId: ProfileAttributes['profileId'];
  seasonId: SeasonsAttributes['seasonId'];
};

async function getLeagueInvites(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { profileId: profileIdPathParam, seasonId: seasonIdPathParam } =
    req.params;
  try {
    const { profileId, seasonId } =
      leagueInviteControllerHelper.validateGetLeagueInvites({
        profileId: profileIdPathParam,
        seasonId: seasonIdPathParam,
      });

    const leagueInviteService = container.resolve(LeagueInviteService);

    const leagueInvites: LeagueInvite[] =
      await leagueInviteService.getLeagueInvitesForProfile({
        profileId,
        seasonId,
      });

    const response: GetLeagueInvitesResponse = {
      success: true,
      statusCode: 200,
      message: 'League invites fetched successfully',
      responseData: {
        leagueInvites: leagueInvites.map((leagueInvite) =>
          leagueInvite.toDTO()
        ),
        numLeagueInvites: leagueInvites.length,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function sendLeagueInvite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const {
    inviterProfileId: inviterProfileIdString,
    invitedProfileId: invitedProfileIdString,
    leagueId: leagueIdString,
  } = req.body;
  try {
    const { inviterProfileId, invitedProfileId, leagueId } =
      leagueInviteControllerHelper.validateSendLeagueInvite({
        inviterProfileId: inviterProfileIdString,
        invitedProfileId: invitedProfileIdString,
        leagueId: leagueIdString,
      });

    await container.resolve(LeagueInviteService).sendLeagueInvite({
      inviterProfileId: inviterProfileId,
      invitedProfileId: invitedProfileId,
      leagueId: leagueId,
    });

    //@ts-ignore
    const response: CreateAndSendLeagueInviteResponse = {
      success: true,
      statusCode: 200,
      message: 'League invite sent successfully',
    };

    res.status(response.statusCode).json(response);
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
    const { invitedProfileId, leagueId, inviteResponse } =
      leagueInviteControllerHelper.validateRespondToLeagueInvite({
        leagueId: req.body.leagueId,
        invitedProfileId: req.body.invitedProfileId,
        inviteResponse: req.body.inviteResponse,
      });

    const leagueInvite = await container
      .resolve(LeagueInviteService)
      .respondToLeagueInvite({
        leagueId: leagueId,
        invitedProfileId: invitedProfileId,
        inviteResponse: inviteResponse,
      });

    const response: RespondToLeagueInviteResponse = {
      success: true,
      statusCode: 200,
      message:
        inviteResponse === InviteResponse.Accept
          ? 'Welcome to the league!'
          : 'League invite declined',
      responseData: {
        league: leagueInvite.getLeague().toDTO(),
        inviteResponse: inviteResponse,
      },
    };

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
}

export default leagueInviteController;
