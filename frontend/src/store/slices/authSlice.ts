import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, User, ResponseError, Account } from "../../types/auth.ts";
import { SignUpFormData, LogInFormData } from "../../utils/auth/formValidation.ts";
import { loginUserService, logoutUserService, signupUserService } from "../../services/auth/authService.ts";

import { closeModal } from "./modalSlice.ts";

enum AuthActionTypes {
    Signup = 'auth/signupUser',
    Login = 'auth/loginUser',
    Logout = 'auth/logoutUser'
}

const storedToken = sessionStorage.getItem('token');
const storedAccount = sessionStorage.getItem('account');

const initialState: AuthState = {
    account: storedAccount ? JSON.parse(storedAccount) : null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null
}

const sessionManager = {
    set: (token: string, account: Account) => {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('account', JSON.stringify(account));
    },
    clear: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('account');
    }
}

const handleError = (error: any) : ResponseError => ({
    message: error.response?.data?.message || 'Unexpected error...',
    statusCode: error.response?.status || 500
});

interface AccountActionPayload {
    account: Account;
    token: string;
}
export const signupUser = createAsyncThunk<AccountActionPayload, SignUpFormData, { rejectValue: ResponseError }>(
    AuthActionTypes.Signup,
    async (userData, { rejectWithValue }) => {
        try {
            const { token, account } = await signupUserService(userData);
            sessionManager.set(token, account);
            return { account, token };
        } catch (error: any) {
            return rejectWithValue(handleError(error));
        }
    }
);
export const loginUser = createAsyncThunk<AccountActionPayload, LogInFormData, { rejectValue: ResponseError }>(
    AuthActionTypes.Login, 
    async (userData, { rejectWithValue }) => {
        try {
            const { token, account } = await loginUserService(userData);
            sessionManager.set(token, account);
            return { account, token };
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

const setUserState = (state: AuthState, action: { payload?: AccountActionPayload }) => {
    state.loading = false;
    state.account = action.payload?.account || null;
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
            state.account = null;
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
                state.account = null;
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