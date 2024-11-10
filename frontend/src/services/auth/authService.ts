import axios from 'axios';
import { LogInFormData, SignUpFormData } from '../../utils/auth/formValidation';
import { Account } from '../../types/auth';

const API_URL = 'http://localhost:3000/api/auth';

export const loginUserService = async (userData: LogInFormData) : Promise<{token:string, account:Account}> => {
    const response = await axios.post(`${API_URL}/login`, userData);
    const token = response.headers['authorization']?.split(' ')[1];
    const account = response.data.account;
    return { token, account };
};

export const signupUserService = async (userData: SignUpFormData) : Promise<{token:string, account:Account}> => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    const token = response.headers['authorization']?.split(' ')[1];
    const account = response.data.account;
    return { token, account };
};

export const logoutUserService = async (token: string) => {
    const response = await axios.post(`${API_URL}/logout`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}