import { AxiosResponse } from 'axios';
import { LoginUserRequestBody, LoginUserResponse, LogoutUserResponse, SignupUserRequestBody, SignupUserResponse } from '../../../generated-api';


import api from '../apiContainer';
import { ApiRequestParams } from '../../hooks/useApi';

const authService = {
    loginUser,
    signupUser,
    logoutUser,
}

async function loginUser({ body }: ApiRequestParams<LoginUserRequestBody, void>): Promise<LoginUserResponse> {
    if (!body) {
        throw Error("Request body is required");
    }
    const response = await api.UserSessionServiceApi.loginUser(body, { withCredentials: true });
    return response.data
    // const response = await axios.post(`${API_URL}/login`, userData, { withCredentials: true });

    // const numSecondsRefreshTokenExpiresIn = response.data.numSecondsRefreshTokenExpiresIn;
    // const account = response.data.account;
    // const message = response.data.message;
    // const isAuthenticated = response.data.isAuthenticated;
    // return { numSecondsRefreshTokenExpiresIn, account, message, isAuthenticated };
};

async function signupUser(params: ApiRequestParams<SignupUserRequestBody, void>): Promise<AxiosResponse<SignupUserResponse>> {
    if (!params) {
        throw Error("Request body is required");
    }
    const response = await api.UserSessionServiceApi.signupUser(params.body, { withCredentials: true });
    return response;
}

async function logoutUser(): Promise<LogoutUserResponse> {
    const response = await api.UserSessionServiceApi.logoutUser({ withCredentials: true });
    return response.data;
}

// export const signupUserService = async (userData: SignUpFormData): Promise<UserSessionResponseSuccess> => {
//     const response = await axios.post(`${API_URL}/signup`, userData, { withCredentials: true });
//     const account = response.data.account;
//     const numSecondsRefreshTokenExpiresIn = response.data.numSecondsRefreshTokenExpiresIn;
//     const message = response.data.message;
//     const isAuthenticated = response.data.isAuthenticated;
//     return { account, numSecondsRefreshTokenExpiresIn, message, isAuthenticated };
// };

// export const logoutUserService = async () => {
//     const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
//     return response.data;
// }

// export const checkAuthService = async (profileId?: string): Promise<UserSessionResponseSuccess> => {
//     const response = await axios.get(`${API_URL}/check-auth`, { withCredentials: true, params: { profileId } });
//     const isAuthenticated = response.data.isAuthenticated;
//     const account = response.data.account;
//     const numSecondsRefreshTokenExpiresIn = response.data.numSecondsRefreshTokenExpiresIn;
//     const message = response.data.message;
//     return { isAuthenticated, account, numSecondsRefreshTokenExpiresIn, message }
// }

// export const extendSessionService = async (profileId?: string): Promise<UserSessionResponseSuccess> => {
//     const response = await axios.post(`${API_URL}/extend-session`, {}, { withCredentials: true, params: { profileId } });
//     const isAuthenticated = response.data.isAuthenticated;
//     const account = response.data.account;
//     const numSecondsRefreshTokenExpiresIn = response.data.numSecondsRefreshTokenExpiresIn;
//     const message = response.data.message;
//     return { isAuthenticated, account, numSecondsRefreshTokenExpiresIn, message }
// };

export default authService;