import { AxiosResponse } from "axios";
import { CreateAndSendLeagueInviteRequestBody, CreateAndSendLeagueInviteResponse, GetLeagueInvitesForPlayerResponse, RespondToLeagueInviteRequestBody, RespondToLeagueInviteResponse } from "../../../generated-api";
import api from "../apiContainer";
import { ApiRequestParams } from "../../hooks/useApi";

export interface RespondToLeagueInviteRequestParams {
    queryParams?: undefined | null
}

export interface GetLeagueInvitesForProfileRequestParams {
    profileId: string
}

export type SendLeagueInviteRequestParams = void;

const leagueInviteService = {
    respondToLeagueInvite,
    getLeagueInvitesForProfile,
    sendLeagueInvite
}

async function respondToLeagueInvite(
        requestData: ApiRequestParams<RespondToLeagueInviteRequestBody, void>

): Promise<AxiosResponse<RespondToLeagueInviteResponse>> {
    if (!requestData.body) {
        throw new Error("Request body is required");
    }

    const response = await api.leagueInviteService.respondToLeagueInvite(requestData.body, { withCredentials: true })
    return response;
}

async function getLeagueInvitesForProfile(
    requestData: ApiRequestParams<void, GetLeagueInvitesForProfileRequestParams>
):
    Promise<AxiosResponse<GetLeagueInvitesForPlayerResponse>> {
    const response = await api.leagueInviteService.getLeagueInvitesForPlayer(requestData.queryParams.profileId, { withCredentials: true });
    return response;
}

async function sendLeagueInvite(requestData: ApiRequestParams<CreateAndSendLeagueInviteRequestBody, SendLeagueInviteRequestParams>): Promise<AxiosResponse<CreateAndSendLeagueInviteResponse>> {
    const response = await api.leagueInviteService.createAndSendLeagueInvite(requestData.body, { withCredentials: true });
    return response;
}


export default leagueInviteService;