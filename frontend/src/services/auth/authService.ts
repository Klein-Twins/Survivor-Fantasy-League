import axios from 'axios';
import { LogInFormData, SignUpFormData } from '../../utils/auth/formValidation';

const API_URL = 'http://localhost:3000/api/auth';

export const loginUserService = async (userData: LogInFormData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    const token = response.headers['authorization']?.split(' ')[1];
    const user = response.data.user;
    return { token, user };
};

export const signupUserService = async (userData: SignUpFormData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    const token = response.headers['authorization']?.split(' ')[1];
    const user = response.data.user;
    return { token, user };
};

export const logoutUserService = async (token: string) => {
    const response = await axios.post(`${API_URL}/logout`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}