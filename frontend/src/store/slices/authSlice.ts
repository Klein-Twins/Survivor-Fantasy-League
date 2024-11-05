import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthState, User, ResponseError } from "../../types/auth.ts";
import { SignUpFormData, LogInFormData } from "../../utils/auth/formValidation.ts";

const storedToken = sessionStorage.getItem('token');
const storedUser = sessionStorage.getItem('user');
const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null
}

export const signupUser = createAsyncThunk<
    { user: User, token: string },
    SignUpFormData,
    { rejectValue: ResponseError }
>('auth/signupUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/signup', userData );
        const { token, user } = response.data;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        return { user, token };
    } catch (error: any) {
        return rejectWithValue({
            message: error.response?.data?.message || 'Signup failed',
            statusCode: error.response?.status || 500 // Fallback to 500 if no status is available
        });
    }
});

export const loginUser = createAsyncThunk<
    { user: User, token: string },
    LogInFormData,
    { rejectValue: ResponseError }
>('auth/loginUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/login', userData );
        const { token, user } = response.data;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        return { user, token };
    } catch (error: any) {
        return rejectWithValue({
            message: error.response?.data?.message || 'Signup failed',
            statusCode: error.response?.status || 500 // Fallback to 500 if no status is available
        });
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            //sign up action
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? {
                    message: action.payload.message,
                    statusCode: action.payload.statusCode
                } : {
                    message: 'Unexpected error...',
                    statusCode: 500
                };
            })
            //Log in user custom action
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? {
                    message: action.payload.message,
                    statusCode: action.payload.statusCode
                } : {
                    message: 'Unexpected error...',
                    statusCode: 500
                };
            });
    },
});

export const { logout } =  authSlice.actions;
export default authSlice.reducer;