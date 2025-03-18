/* tslint:disable */
/* eslint-disable */
/**
 * Survivor Fantasy League - OpenAPI 3.0.3
 * This is the Survivor Fantasy League Spec for API's
 *
 * OpenAPI spec version: 1.0.11
 * Contact: pklein111697@gmail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import globalAxios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { CreateAndSendLeagueInviteRequestBody } from '../models';
import { CreateAndSendLeagueInviteResponse } from '../models';
import { GetLeagueInvitesResponse } from '../models';
import { RespondToLeagueInviteRequestBody } from '../models';
import { RespondToLeagueInviteResponse } from '../models';
/**
 * LeagueInviteServiceApi - axios parameter creator
 * @export
 */
export const LeagueInviteServiceApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * This endpoint allows the user to create a new league invite for a profile and then send the invite to them.
         * @summary Create and send league invite for a profile
         * @param {CreateAndSendLeagueInviteRequestBody} body 
         * @param {string} [profileId] The ID of the profile.
         * @param {number} [seasonId] The ID of the season.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createAndSendLeagueInvite: async (body: CreateAndSendLeagueInviteRequestBody, profileId?: string, seasonId?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling createAndSendLeagueInvite.');
            }
            const localVarPath = `/api/league/invite/{profileId}/{seasonId}`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication accessTokenCookie required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("accessToken")
                    : await configuration.apiKey;
                localVarQueryParameter["accessToken"] = localVarApiKeyValue;
            }

            // authentication refreshTokenCookie required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("refreshToken")
                    : await configuration.apiKey;
                localVarQueryParameter["refreshToken"] = localVarApiKeyValue;
            }

            if (profileId !== undefined) {
                localVarQueryParameter['profileId'] = profileId;
            }

            if (seasonId !== undefined) {
                localVarQueryParameter['seasonId'] = seasonId;
            }

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * This endpoint will retrieve all pending league invitations for a player.
         * @summary Retrieve league invites for a player
         * @param {string} profileId The ID of the profile.
         * @param {number} seasonId The ID of the season.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLeagueInvitesForPlayer: async (profileId: string, seasonId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'profileId' is not null or undefined
            if (profileId === null || profileId === undefined) {
                throw new RequiredError('profileId','Required parameter profileId was null or undefined when calling getLeagueInvitesForPlayer.');
            }
            // verify required parameter 'seasonId' is not null or undefined
            if (seasonId === null || seasonId === undefined) {
                throw new RequiredError('seasonId','Required parameter seasonId was null or undefined when calling getLeagueInvitesForPlayer.');
            }
            const localVarPath = `/api/league/invite/{profileId}/{seasonId}`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication accessTokenCookie required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("accessToken")
                    : await configuration.apiKey;
                localVarQueryParameter["accessToken"] = localVarApiKeyValue;
            }

            // authentication refreshTokenCookie required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("refreshToken")
                    : await configuration.apiKey;
                localVarQueryParameter["refreshToken"] = localVarApiKeyValue;
            }

            if (profileId !== undefined) {
                localVarQueryParameter['profileId'] = profileId;
            }

            if (seasonId !== undefined) {
                localVarQueryParameter['seasonId'] = seasonId;
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * This endpoint allows the user to accept or decline a league invitation.
         * @summary Respond to a league invite
         * @param {RespondToLeagueInviteRequestBody} body 
         * @param {string} profileId The ID of the profile.
         * @param {number} seasonId The ID of the season.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        respondToLeagueInvite: async (body: RespondToLeagueInviteRequestBody, profileId: string, seasonId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling respondToLeagueInvite.');
            }
            // verify required parameter 'profileId' is not null or undefined
            if (profileId === null || profileId === undefined) {
                throw new RequiredError('profileId','Required parameter profileId was null or undefined when calling respondToLeagueInvite.');
            }
            // verify required parameter 'seasonId' is not null or undefined
            if (seasonId === null || seasonId === undefined) {
                throw new RequiredError('seasonId','Required parameter seasonId was null or undefined when calling respondToLeagueInvite.');
            }
            const localVarPath = `/api/league/invite/{profileId}/{seasonId}`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication accessTokenCookie required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("accessToken")
                    : await configuration.apiKey;
                localVarQueryParameter["accessToken"] = localVarApiKeyValue;
            }

            // authentication refreshTokenCookie required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("refreshToken")
                    : await configuration.apiKey;
                localVarQueryParameter["refreshToken"] = localVarApiKeyValue;
            }

            if (profileId !== undefined) {
                localVarQueryParameter['profileId'] = profileId;
            }

            if (seasonId !== undefined) {
                localVarQueryParameter['seasonId'] = seasonId;
            }

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * LeagueInviteServiceApi - functional programming interface
 * @export
 */
export const LeagueInviteServiceApiFp = function(configuration?: Configuration) {
    return {
        /**
         * This endpoint allows the user to create a new league invite for a profile and then send the invite to them.
         * @summary Create and send league invite for a profile
         * @param {CreateAndSendLeagueInviteRequestBody} body 
         * @param {string} [profileId] The ID of the profile.
         * @param {number} [seasonId] The ID of the season.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createAndSendLeagueInvite(body: CreateAndSendLeagueInviteRequestBody, profileId?: string, seasonId?: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<CreateAndSendLeagueInviteResponse>>> {
            const localVarAxiosArgs = await LeagueInviteServiceApiAxiosParamCreator(configuration).createAndSendLeagueInvite(body, profileId, seasonId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * This endpoint will retrieve all pending league invitations for a player.
         * @summary Retrieve league invites for a player
         * @param {string} profileId The ID of the profile.
         * @param {number} seasonId The ID of the season.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLeagueInvitesForPlayer(profileId: string, seasonId: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<GetLeagueInvitesResponse>>> {
            const localVarAxiosArgs = await LeagueInviteServiceApiAxiosParamCreator(configuration).getLeagueInvitesForPlayer(profileId, seasonId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * This endpoint allows the user to accept or decline a league invitation.
         * @summary Respond to a league invite
         * @param {RespondToLeagueInviteRequestBody} body 
         * @param {string} profileId The ID of the profile.
         * @param {number} seasonId The ID of the season.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async respondToLeagueInvite(body: RespondToLeagueInviteRequestBody, profileId: string, seasonId: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<RespondToLeagueInviteResponse>>> {
            const localVarAxiosArgs = await LeagueInviteServiceApiAxiosParamCreator(configuration).respondToLeagueInvite(body, profileId, seasonId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * LeagueInviteServiceApi - factory interface
 * @export
 */
export const LeagueInviteServiceApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * This endpoint allows the user to create a new league invite for a profile and then send the invite to them.
         * @summary Create and send league invite for a profile
         * @param {CreateAndSendLeagueInviteRequestBody} body 
         * @param {string} [profileId] The ID of the profile.
         * @param {number} [seasonId] The ID of the season.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createAndSendLeagueInvite(body: CreateAndSendLeagueInviteRequestBody, profileId?: string, seasonId?: number, options?: AxiosRequestConfig): Promise<AxiosResponse<CreateAndSendLeagueInviteResponse>> {
            return LeagueInviteServiceApiFp(configuration).createAndSendLeagueInvite(body, profileId, seasonId, options).then((request) => request(axios, basePath));
        },
        /**
         * This endpoint will retrieve all pending league invitations for a player.
         * @summary Retrieve league invites for a player
         * @param {string} profileId The ID of the profile.
         * @param {number} seasonId The ID of the season.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLeagueInvitesForPlayer(profileId: string, seasonId: number, options?: AxiosRequestConfig): Promise<AxiosResponse<GetLeagueInvitesResponse>> {
            return LeagueInviteServiceApiFp(configuration).getLeagueInvitesForPlayer(profileId, seasonId, options).then((request) => request(axios, basePath));
        },
        /**
         * This endpoint allows the user to accept or decline a league invitation.
         * @summary Respond to a league invite
         * @param {RespondToLeagueInviteRequestBody} body 
         * @param {string} profileId The ID of the profile.
         * @param {number} seasonId The ID of the season.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async respondToLeagueInvite(body: RespondToLeagueInviteRequestBody, profileId: string, seasonId: number, options?: AxiosRequestConfig): Promise<AxiosResponse<RespondToLeagueInviteResponse>> {
            return LeagueInviteServiceApiFp(configuration).respondToLeagueInvite(body, profileId, seasonId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * LeagueInviteServiceApi - object-oriented interface
 * @export
 * @class LeagueInviteServiceApi
 * @extends {BaseAPI}
 */
export class LeagueInviteServiceApi extends BaseAPI {
    /**
     * This endpoint allows the user to create a new league invite for a profile and then send the invite to them.
     * @summary Create and send league invite for a profile
     * @param {CreateAndSendLeagueInviteRequestBody} body 
     * @param {string} [profileId] The ID of the profile.
     * @param {number} [seasonId] The ID of the season.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LeagueInviteServiceApi
     */
    public async createAndSendLeagueInvite(body: CreateAndSendLeagueInviteRequestBody, profileId?: string, seasonId?: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<CreateAndSendLeagueInviteResponse>> {
        return LeagueInviteServiceApiFp(this.configuration).createAndSendLeagueInvite(body, profileId, seasonId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * This endpoint will retrieve all pending league invitations for a player.
     * @summary Retrieve league invites for a player
     * @param {string} profileId The ID of the profile.
     * @param {number} seasonId The ID of the season.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LeagueInviteServiceApi
     */
    public async getLeagueInvitesForPlayer(profileId: string, seasonId: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<GetLeagueInvitesResponse>> {
        return LeagueInviteServiceApiFp(this.configuration).getLeagueInvitesForPlayer(profileId, seasonId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * This endpoint allows the user to accept or decline a league invitation.
     * @summary Respond to a league invite
     * @param {RespondToLeagueInviteRequestBody} body 
     * @param {string} profileId The ID of the profile.
     * @param {number} seasonId The ID of the season.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LeagueInviteServiceApi
     */
    public async respondToLeagueInvite(body: RespondToLeagueInviteRequestBody, profileId: string, seasonId: number, options?: AxiosRequestConfig) : Promise<AxiosResponse<RespondToLeagueInviteResponse>> {
        return LeagueInviteServiceApiFp(this.configuration).respondToLeagueInvite(body, profileId, seasonId, options).then((request) => request(this.axios, this.basePath));
    }
}
