import axios from 'axios';
import { LogInFormData, SignUpFormData } from '../../utils/auth/formValidation';
import { Account } from '../../types/auth';

const API_URL = 'http://localhost:3000/api/auth';

export const loginUserService = async (userData: LogInFormData) : Promise<{account:Account}> => {
    const response = await axios.post(`${API_URL}/login`, userData, {withCredentials: true});
    const account = response.data.account;
    return { account };
};

export const signupUserService = async (userData: SignUpFormData) : Promise<{account:Account}> => {
    const response = await axios.post(`${API_URL}/signup`, userData, {withCredentials: true});
    const account = response.data.account;
    return { account };
};

export const logoutUserService = async () => {
    const response = await axios.post(`${API_URL}/logout`, {}, {withCredentials:true});
    return response.data;
}

interface TokenExpirationResponse {
    remainingTime: number;
}
export const getRefreshTokenExpirationService = async () : Promise<TokenExpirationResponse | null> => {
    try {
        const response = await axios.get<TokenExpirationResponse>(`${API_URL}/refresh-token-expires-in`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch token expiration: ${error}`);
        return null;
    }
}

interface CheckAuthResponse {
    isAuthenticated: boolean
}
export const checkAuthService = async () : Promise<boolean> => {
    const response = await axios.get<CheckAuthResponse>(`${API_URL}/check-auth`, {withCredentials:true});
    return response.data.isAuthenticated;
}

export const extendSessionService = async () => {
    try {
        await axios.post(`${API_URL}/extend-session`, {}, { withCredentials: true });
        return true;
    } catch (error) {
        console.error("Failed to extend session:", error);
        return false;
    }
};