import { Request, Response, NextFunction } from 'express';
import {
  CreateAndSendLeagueInviteRequestBody,
  CreateAndSendLeagueInviteResponse,
  GetLeagueInvitesForPlayerResponse,
  League,
  LeagueInvite,
  RespondToLeagueInviteRequestBody,
  RespondToLeagueInviteRequestBodyInviteResponseEnum,
  RespondToLeagueInviteResponse,
  RespondToLeagueInviteResponseData,
} from '../../generated-api';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';
import leagueMemberHelper from '../../servicesAndHelpers/leagues/leagueMemberHelper';
import leagueMemberService from '../../servicesAndHelpers/leagues/leagueMemberService';

const leagueInviteController = {
  getLeagueInvitesForProfileId,
  createAndSendLeagueInvite,
  respondToLeagueInvite,
};

async function getLeagueInvitesForProfileId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profileId = req.query.profileId as string | undefined;
    const validationError = await leagueMemberHelper.validateGetLeagueInvitesForProfileIdRequest(profileId);
    if (validationError) {
      throw validationError;
    }

    const leagueInvites: LeagueInvite[] = await leagueMemberRepository.getLeagueInvitesForProfileId(
      profileId as string
    );

    const response: GetLeagueInvitesForPlayerResponse = {
      success: true,
      message: leagueInvites.length > 0 ? 'League invites retrieved' : 'No league invites found',
      statusCode: 200,
      responseData: {
        leagueInvites,
        numLeagueInvites: leagueInvites.length,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
async function createAndSendLeagueInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const requestBody: CreateAndSendLeagueInviteRequestBody = req.body;

    const validationError = await leagueMemberHelper.validateInviteMemberToLeagueRequest(requestBody);
    if (validationError) {
      throw validationError;
    }

    await leagueMemberService.inviteProfileToLeague(requestBody);

    const response: CreateAndSendLeagueInviteResponse = {
      success: true,
      message: 'League invite sent',
      statusCode: 200,
    };

    res.sendStatus(200).json(response);
  } catch (error) {
    next(error);
  }
}
async function respondToLeagueInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const requestBody: RespondToLeagueInviteRequestBody = req.body;

    const validationError = await leagueMemberHelper.validateRespondToLeagueInviteRequest(requestBody);
    if (validationError) {
      throw validationError;
    }

    const league: League | null = await leagueMemberService.respondToLeagueInvite(requestBody);

    const responseData: RespondToLeagueInviteResponseData = {
      league: league ? league : undefined,
    };

    const response: RespondToLeagueInviteResponse = {
      success: true,
      message:
        requestBody.inviteResponse === RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT
          ? 'You have successfully joined the league'
          : 'You have declined the league invite',
      statusCode: 200,
      responseData,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export default leagueInviteController;
