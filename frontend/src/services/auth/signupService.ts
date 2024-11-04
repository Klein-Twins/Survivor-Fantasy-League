import axios from "axios";

const API_URL = 'http://localhost:3000/api/auth/signup';

interface SignupData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
}

export const signup = async(data: SignupData) => {
    const response = await axios.post(API_URL, data);
    return response.data;
}