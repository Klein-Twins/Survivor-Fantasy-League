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
import { ApiError } from '../models';
import { CheckAuthResponse } from '../models';
import { ExtendSessionResponse } from '../models';
import { LoginUserRequestBody } from '../models';
import { LoginUserResponse } from '../models';
import { LogoutUserResponse } from '../models';
import { SignupUserRequestBody } from '../models';
import { SignupUserResponse } from '../models';
/**
 * UserSessionServiceApi - axios parameter creator
 * @export
 */
export const UserSessionServiceApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * This endpoint verifies if the refresh token is valid. It is used to confirm  the user's authentication status, such as during a page reload. Requires the  refresh token cookie and the associated profile ID as input. 
         * @summary Validate refresh token authenticity
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        checkAuth: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/auth/check-auth`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication refreshTokenCookie required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("refreshToken")
                    : await configuration.apiKey;
                localVarQueryParameter["refreshToken"] = localVarApiKeyValue;
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
         * Extends the user session by generating a new refresh token and access token,  if the refresh token is valid. The response includes both tokens set as cookies  and a time-to-expiry value for the refresh token. 
         * @summary Extend user session
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        extendSession: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/auth/extend-session`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication refreshTokenCookie required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("refreshToken")
                    : await configuration.apiKey;
                localVarQueryParameter["refreshToken"] = localVarApiKeyValue;
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
         * Logs in a user by validating their credentials. Upon success: - Access and refresh tokens are set in `Set-Cookie` headers. - A success message and account details are returned in the response body.
         * @summary Login a user
         * @param {LoginUserRequestBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        loginUser: async (body: LoginUserRequestBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling loginUser.');
            }
            const localVarPath = `/api/auth/login`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

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
         * Logs out a user by invalidating their JWT tokens, clearing any session information,  and removing cookies from the client. - If the cookies are missing or tampered with, appropriate errors are returned. 
         * @summary Log out a user
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logoutUser: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/auth/logout`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

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
         * Creates a new user account and returns authentication tokens via cookies. Upon success: - Access and refresh tokens are set in `Set-Cookie` headers. - A success message and account details are returned in the response body. 
         * @summary Registers a new user account
         * @param {SignupUserRequestBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        signupUser: async (body: SignupUserRequestBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling signupUser.');
            }
            const localVarPath = `/api/auth/signup`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

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
 * UserSessionServiceApi - functional programming interface
 * @export
 */
export const UserSessionServiceApiFp = function(configuration?: Configuration) {
    return {
        /**
         * This endpoint verifies if the refresh token is valid. It is used to confirm  the user's authentication status, such as during a page reload. Requires the  refresh token cookie and the associated profile ID as input. 
         * @summary Validate refresh token authenticity
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async checkAuth(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<CheckAuthResponse>>> {
            const localVarAxiosArgs = await UserSessionServiceApiAxiosParamCreator(configuration).checkAuth(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Extends the user session by generating a new refresh token and access token,  if the refresh token is valid. The response includes both tokens set as cookies  and a time-to-expiry value for the refresh token. 
         * @summary Extend user session
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async extendSession(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<ExtendSessionResponse>>> {
            const localVarAxiosArgs = await UserSessionServiceApiAxiosParamCreator(configuration).extendSession(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Logs in a user by validating their credentials. Upon success: - Access and refresh tokens are set in `Set-Cookie` headers. - A success message and account details are returned in the response body.
         * @summary Login a user
         * @param {LoginUserRequestBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async loginUser(body: LoginUserRequestBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<LoginUserResponse>>> {
            const localVarAxiosArgs = await UserSessionServiceApiAxiosParamCreator(configuration).loginUser(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Logs out a user by invalidating their JWT tokens, clearing any session information,  and removing cookies from the client. - If the cookies are missing or tampered with, appropriate errors are returned. 
         * @summary Log out a user
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async logoutUser(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<LogoutUserResponse>>> {
            const localVarAxiosArgs = await UserSessionServiceApiAxiosParamCreator(configuration).logoutUser(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Creates a new user account and returns authentication tokens via cookies. Upon success: - Access and refresh tokens are set in `Set-Cookie` headers. - A success message and account details are returned in the response body. 
         * @summary Registers a new user account
         * @param {SignupUserRequestBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async signupUser(body: SignupUserRequestBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<SignupUserResponse>>> {
            const localVarAxiosArgs = await UserSessionServiceApiAxiosParamCreator(configuration).signupUser(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * UserSessionServiceApi - factory interface
 * @export
 */
export const UserSessionServiceApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * This endpoint verifies if the refresh token is valid. It is used to confirm  the user's authentication status, such as during a page reload. Requires the  refresh token cookie and the associated profile ID as input. 
         * @summary Validate refresh token authenticity
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async checkAuth(options?: AxiosRequestConfig): Promise<AxiosResponse<CheckAuthResponse>> {
            return UserSessionServiceApiFp(configuration).checkAuth(options).then((request) => request(axios, basePath));
        },
        /**
         * Extends the user session by generating a new refresh token and access token,  if the refresh token is valid. The response includes both tokens set as cookies  and a time-to-expiry value for the refresh token. 
         * @summary Extend user session
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async extendSession(options?: AxiosRequestConfig): Promise<AxiosResponse<ExtendSessionResponse>> {
            return UserSessionServiceApiFp(configuration).extendSession(options).then((request) => request(axios, basePath));
        },
        /**
         * Logs in a user by validating their credentials. Upon success: - Access and refresh tokens are set in `Set-Cookie` headers. - A success message and account details are returned in the response body.
         * @summary Login a user
         * @param {LoginUserRequestBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async loginUser(body: LoginUserRequestBody, options?: AxiosRequestConfig): Promise<AxiosResponse<LoginUserResponse>> {
            return UserSessionServiceApiFp(configuration).loginUser(body, options).then((request) => request(axios, basePath));
        },
        /**
         * Logs out a user by invalidating their JWT tokens, clearing any session information,  and removing cookies from the client. - If the cookies are missing or tampered with, appropriate errors are returned. 
         * @summary Log out a user
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async logoutUser(options?: AxiosRequestConfig): Promise<AxiosResponse<LogoutUserResponse>> {
            return UserSessionServiceApiFp(configuration).logoutUser(options).then((request) => request(axios, basePath));
        },
        /**
         * Creates a new user account and returns authentication tokens via cookies. Upon success: - Access and refresh tokens are set in `Set-Cookie` headers. - A success message and account details are returned in the response body. 
         * @summary Registers a new user account
         * @param {SignupUserRequestBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async signupUser(body: SignupUserRequestBody, options?: AxiosRequestConfig): Promise<AxiosResponse<SignupUserResponse>> {
            return UserSessionServiceApiFp(configuration).signupUser(body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserSessionServiceApi - object-oriented interface
 * @export
 * @class UserSessionServiceApi
 * @extends {BaseAPI}
 */
export class UserSessionServiceApi extends BaseAPI {
    /**
     * This endpoint verifies if the refresh token is valid. It is used to confirm  the user's authentication status, such as during a page reload. Requires the  refresh token cookie and the associated profile ID as input. 
     * @summary Validate refresh token authenticity
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserSessionServiceApi
     */
    public async checkAuth(options?: AxiosRequestConfig) : Promise<AxiosResponse<CheckAuthResponse>> {
        return UserSessionServiceApiFp(this.configuration).checkAuth(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Extends the user session by generating a new refresh token and access token,  if the refresh token is valid. The response includes both tokens set as cookies  and a time-to-expiry value for the refresh token. 
     * @summary Extend user session
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserSessionServiceApi
     */
    public async extendSession(options?: AxiosRequestConfig) : Promise<AxiosResponse<ExtendSessionResponse>> {
        return UserSessionServiceApiFp(this.configuration).extendSession(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Logs in a user by validating their credentials. Upon success: - Access and refresh tokens are set in `Set-Cookie` headers. - A success message and account details are returned in the response body.
     * @summary Login a user
     * @param {LoginUserRequestBody} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserSessionServiceApi
     */
    public async loginUser(body: LoginUserRequestBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<LoginUserResponse>> {
        return UserSessionServiceApiFp(this.configuration).loginUser(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Logs out a user by invalidating their JWT tokens, clearing any session information,  and removing cookies from the client. - If the cookies are missing or tampered with, appropriate errors are returned. 
     * @summary Log out a user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserSessionServiceApi
     */
    public async logoutUser(options?: AxiosRequestConfig) : Promise<AxiosResponse<LogoutUserResponse>> {
        return UserSessionServiceApiFp(this.configuration).logoutUser(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Creates a new user account and returns authentication tokens via cookies. Upon success: - Access and refresh tokens are set in `Set-Cookie` headers. - A success message and account details are returned in the response body. 
     * @summary Registers a new user account
     * @param {SignupUserRequestBody} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserSessionServiceApi
     */
    public async signupUser(body: SignupUserRequestBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<SignupUserResponse>> {
        return UserSessionServiceApiFp(this.configuration).signupUser(body, options).then((request) => request(this.axios, this.basePath));
    }
}
