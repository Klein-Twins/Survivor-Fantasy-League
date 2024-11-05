import axios from 'axios';
import { LogInFormData, SignUpFormData } from '../../utils/auth/formValidation';

const API_URL = 'http://localhost:3000/api/auth';

export const loginUserService = async (userData: LogInFormData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

export const signupUserService = async (userData: SignUpFormData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
};