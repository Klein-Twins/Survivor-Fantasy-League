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
      await leagueInviteService.getLeagueInvites({
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

    LeagueInviteService;

    //@ts-ignore
    const response: CreateAndSendLeagueInviteResponse = {
      success: true,
      statusCode: 200,
      message: 'League invite sent successfully',
    };
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
    throw new NotImplementedError(
      'respondToLeagueInvite is not implemented yet. Please check back later.'
    );
  } catch (error) {
    next(error);
  }
}

export default leagueInviteController;
