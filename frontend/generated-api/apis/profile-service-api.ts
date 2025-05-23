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
import { LeagueInviteProfileSearchResponse } from '../models';
import { SortByEnum } from '../models';
/**
 * ProfileServiceApi - axios parameter creator
 * @export
 */
export const ProfileServiceApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * This endpoint allows you to search for profiles based on username, first name, and league ID, with pagination options.
         * @summary Retrieve profiles by search criteria
         * @param {string} leagueId The ID of the league
         * @param {string} [userName] The username of the profile
         * @param {string} [firstName] The first name of the profile
         * @param {string} [lastName] The last name of the profile
         * @param {number} [page] The page number
         * @param {number} [limit] Items per page
         * @param {SortByEnum} [sortBy] Field to sort by
         * @param {boolean} [isAsc] Sort direction
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        searchProfilesForLeagueInvite: async (leagueId: string, userName?: string, firstName?: string, lastName?: string, page?: number, limit?: number, sortBy?: SortByEnum, isAsc?: boolean, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'leagueId' is not null or undefined
            if (leagueId === null || leagueId === undefined) {
                throw new RequiredError('leagueId','Required parameter leagueId was null or undefined when calling searchProfilesForLeagueInvite.');
            }
            const localVarPath = `/api/league/invite/search`;
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

            if (userName !== undefined) {
                localVarQueryParameter['userName'] = userName;
            }

            if (firstName !== undefined) {
                localVarQueryParameter['firstName'] = firstName;
            }

            if (lastName !== undefined) {
                localVarQueryParameter['lastName'] = lastName;
            }

            if (leagueId !== undefined) {
                localVarQueryParameter['leagueId'] = leagueId;
            }

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (sortBy !== undefined) {
                localVarQueryParameter['sortBy'] = sortBy;
            }

            if (isAsc !== undefined) {
                localVarQueryParameter['isAsc'] = isAsc;
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
    }
};

/**
 * ProfileServiceApi - functional programming interface
 * @export
 */
export const ProfileServiceApiFp = function(configuration?: Configuration) {
    return {
        /**
         * This endpoint allows you to search for profiles based on username, first name, and league ID, with pagination options.
         * @summary Retrieve profiles by search criteria
         * @param {string} leagueId The ID of the league
         * @param {string} [userName] The username of the profile
         * @param {string} [firstName] The first name of the profile
         * @param {string} [lastName] The last name of the profile
         * @param {number} [page] The page number
         * @param {number} [limit] Items per page
         * @param {SortByEnum} [sortBy] Field to sort by
         * @param {boolean} [isAsc] Sort direction
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async searchProfilesForLeagueInvite(leagueId: string, userName?: string, firstName?: string, lastName?: string, page?: number, limit?: number, sortBy?: SortByEnum, isAsc?: boolean, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<LeagueInviteProfileSearchResponse>>> {
            const localVarAxiosArgs = await ProfileServiceApiAxiosParamCreator(configuration).searchProfilesForLeagueInvite(leagueId, userName, firstName, lastName, page, limit, sortBy, isAsc, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ProfileServiceApi - factory interface
 * @export
 */
export const ProfileServiceApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * This endpoint allows you to search for profiles based on username, first name, and league ID, with pagination options.
         * @summary Retrieve profiles by search criteria
         * @param {string} leagueId The ID of the league
         * @param {string} [userName] The username of the profile
         * @param {string} [firstName] The first name of the profile
         * @param {string} [lastName] The last name of the profile
         * @param {number} [page] The page number
         * @param {number} [limit] Items per page
         * @param {SortByEnum} [sortBy] Field to sort by
         * @param {boolean} [isAsc] Sort direction
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async searchProfilesForLeagueInvite(leagueId: string, userName?: string, firstName?: string, lastName?: string, page?: number, limit?: number, sortBy?: SortByEnum, isAsc?: boolean, options?: AxiosRequestConfig): Promise<AxiosResponse<LeagueInviteProfileSearchResponse>> {
            return ProfileServiceApiFp(configuration).searchProfilesForLeagueInvite(leagueId, userName, firstName, lastName, page, limit, sortBy, isAsc, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ProfileServiceApi - object-oriented interface
 * @export
 * @class ProfileServiceApi
 * @extends {BaseAPI}
 */
export class ProfileServiceApi extends BaseAPI {
    /**
     * This endpoint allows you to search for profiles based on username, first name, and league ID, with pagination options.
     * @summary Retrieve profiles by search criteria
     * @param {string} leagueId The ID of the league
     * @param {string} [userName] The username of the profile
     * @param {string} [firstName] The first name of the profile
     * @param {string} [lastName] The last name of the profile
     * @param {number} [page] The page number
     * @param {number} [limit] Items per page
     * @param {SortByEnum} [sortBy] Field to sort by
     * @param {boolean} [isAsc] Sort direction
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfileServiceApi
     */
    public async searchProfilesForLeagueInvite(leagueId: string, userName?: string, firstName?: string, lastName?: string, page?: number, limit?: number, sortBy?: SortByEnum, isAsc?: boolean, options?: AxiosRequestConfig) : Promise<AxiosResponse<LeagueInviteProfileSearchResponse>> {
        return ProfileServiceApiFp(this.configuration).searchProfilesForLeagueInvite(leagueId, userName, firstName, lastName, page, limit, sortBy, isAsc, options).then((request) => request(this.axios, this.basePath));
    }
}
