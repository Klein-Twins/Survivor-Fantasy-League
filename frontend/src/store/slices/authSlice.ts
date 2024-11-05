import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, User, ResponseError } from "../../types/auth.ts";
import { SignUpFormData, LogInFormData } from "../../utils/auth/formValidation.ts";
import { loginUserService, signupUserService } from "../../services/auth/authService.ts";

const storedToken = sessionStorage.getItem('token');
const storedUser = sessionStorage.getItem('user');
const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null
}

const setSession = (token: string, user: User) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
}

const clearSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user')
}

const handleError = (error: any) => ({
    message: error.response?.data?.message || 'Unexpected error...',
    statusCode: error.response?.status || 500
});

export const signupUser = createAsyncThunk<
    { user: User, token: string },
    SignUpFormData,
    { rejectValue: ResponseError }
>('auth/signupUser', async (userData, { rejectWithValue }) => {
    try {
        const { token, user } = await signupUserService(userData);
        setSession(token, user);
        return { user, token };
    } catch (error: any) {
        return rejectWithValue(handleError(error));
    }
});

export const loginUser = createAsyncThunk<
    { user: User, token: string },
    LogInFormData,
    { rejectValue: ResponseError }
>('auth/loginUser', async (userData, { rejectWithValue }) => {
    try {
        const { token, user } = await loginUserService(userData);
        setSession(token, user);
        return { user, token };
    } catch (error: any) {
        return rejectWithValue(handleError(error));
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            clearSession();
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
                state.error = action.payload || {
                    message: 'Signup Failed',
                    statusCode: 500
                }
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
                state.error = action.payload || {
                    message: 'Signup Failed',
                    statusCode: 500
                }
            });
    },
});

export const { logout } =  authSlice.actions;
export default authSlice.reducer;