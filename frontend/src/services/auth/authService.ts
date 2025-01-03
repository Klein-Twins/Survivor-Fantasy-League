import axios from 'axios';
import { LogInFormData, SignUpFormData } from '../../utils/auth/formValidation';
import { UserSessionResponseSuccess } from '../../../generated-api';

const API_URL = 'http://localhost:3000/api/auth';

export const loginUserService = async (userData: LogInFormData): Promise<UserSessionResponseSuccess> => {
    const response = await axios.post(`${API_URL}/login`, userData, { withCredentials: true });
    const numSecondsRefreshTokenExpiresIn = response.data.numSecondsRefreshTokenExpiresIn;
    const account = response.data.account;
    const message = response.data.message;
    const isAuthenticated = response.data.isAuthenticated;
    return { numSecondsRefreshTokenExpiresIn, account, message, isAuthenticated };
};

export const signupUserService = async (userData: SignUpFormData): Promise<UserSessionResponseSuccess> => {
    const response = await axios.post(`${API_URL}/signup`, userData, { withCredentials: true });
    const account = response.data.account;
    const numSecondsRefreshTokenExpiresIn = response.data.numSecondsRefreshTokenExpiresIn;
    const message = response.data.message;
    const isAuthenticated = response.data.isAuthenticated;
    return { account, numSecondsRefreshTokenExpiresIn, message, isAuthenticated };
};

export const logoutUserService = async () => {
    const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return response.data;
}

export const checkAuthService = async (profileId?: string): Promise<UserSessionResponseSuccess> => {
    const response = await axios.get(`${API_URL}/check-auth`, { withCredentials: true, params: { profileId } });
    const isAuthenticated = response.data.isAuthenticated;
    const account = response.data.account;
    const numSecondsRefreshTokenExpiresIn = response.data.numSecondsRefreshTokenExpiresIn;
    const message = response.data.message;
    return { isAuthenticated, account, numSecondsRefreshTokenExpiresIn, message }
}

export const extendSessionService = async (profileId?: string): Promise<UserSessionResponseSuccess> => {
    const response = await axios.post(`${API_URL}/extend-session`, {}, { withCredentials: true, params: { profileId } });
    const isAuthenticated = response.data.isAuthenticated;
    const account = response.data.account;
    const numSecondsRefreshTokenExpiresIn = response.data.numSecondsRefreshTokenExpiresIn;
    const message = response.data.message;
    return { isAuthenticated, account, numSecondsRefreshTokenExpiresIn, message }
};