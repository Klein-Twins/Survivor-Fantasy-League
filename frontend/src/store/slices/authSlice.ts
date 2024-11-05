import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, User, ResponseError } from "../../types/auth.ts";
import { SignUpFormData, LogInFormData } from "../../utils/auth/formValidation.ts";
import { loginUserService, logoutUserService, signupUserService } from "../../services/auth/authService.ts";

import { closeModal } from "./modalSlice.ts";

enum AuthActionTypes {
    Signup = 'auth/signupUser',
    Login = 'auth/loginUser',
    Logout = 'auth/logoutUser'
}

const storedToken = sessionStorage.getItem('token');
const storedUser = sessionStorage.getItem('user');

const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null
}

const sessionManager = {
    set: (token: string, user: User) => {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
    },
    clear: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }
}

const handleError = (error: any) : ResponseError => ({
    message: error.response?.data?.message || 'Unexpected error...',
    statusCode: error.response?.status || 500
});

interface UserActionPayload {
    user: User;
    token: string;
}
export const signupUser = createAsyncThunk<UserActionPayload, SignUpFormData, { rejectValue: ResponseError }>(
    AuthActionTypes.Signup,
    async (userData, { rejectWithValue }) => {
        try {
            const { token, user } = await signupUserService(userData);
            sessionManager.set(token, user);
            return { user, token };
        } catch (error: any) {
            return rejectWithValue(handleError(error));
        }
    }
);
export const loginUser = createAsyncThunk<UserActionPayload, LogInFormData, { rejectValue: ResponseError }>(
    AuthActionTypes.Login, 
    async (userData, { rejectWithValue }) => {
        try {
            const { token, user } = await loginUserService(userData);
            sessionManager.set(token, user);
            return { user, token };
        } catch (error: any) {
            return rejectWithValue(handleError(error));
        }
    }
);
export const logoutUser = createAsyncThunk<void, void, { rejectValue: ResponseError }>(
    AuthActionTypes.Logout,
    async(_, { rejectWithValue}) => {
        const token = sessionStorage.getItem('token');
        try {
            if(token) {
                await logoutUserService(token);
            }
            sessionManager.clear();
        } catch (error : any) {
            return rejectWithValue(handleError(error));
        }
    }
)

const setUserState = (state: AuthState, action: { payload?: UserActionPayload }) => {
    state.loading = false;
    state.user = action.payload?.user || null;
    state.isAuthenticated = !!action.payload;
    state.error = action.payload ? null : {
        message: 'Unexpected error - no payload on action...',
        statusCode: 500,
    };
};

const setLoadingState = (state: AuthState) => {
    state.loading = true;
    state.error = null;
}
const setRejectedState = (state: AuthState, action: {payload?: ResponseError}, actionType: string) => {
    state.loading = false;
    state.error = action.payload || {
        message: `${actionType} Failed`,
        statusCode: 500
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            sessionManager.clear();
        }
    },
    extraReducers: (builder) => {
        builder
            //Sign up action
            .addCase(signupUser.pending, setLoadingState)
            .addCase(signupUser.fulfilled, setUserState)
            .addCase(signupUser.rejected, (state, action) => setRejectedState(state, action, 'Signup'))
            //Log in action
            .addCase(loginUser.pending, setLoadingState)
            .addCase(loginUser.fulfilled, setUserState)
            .addCase(loginUser.rejected, (state, action) => setRejectedState(state, action, 'Login'))
            //Log out action
            .addCase(logoutUser.pending, setLoadingState)
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => setRejectedState(state, action, 'Logout'))
            .addCase(closeModal, (state) => {
                state.error = null;
            });
    },
});

export const { logout } =  authSlice.actions;
export default authSlice.reducer;