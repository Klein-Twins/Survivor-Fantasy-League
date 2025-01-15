import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { AuthState, User, ResponseError, Account } from "../../types/auth.ts";
import { SignUpFormData, LogInFormData } from "../../utils/auth/formValidation.ts";
import { checkAuthService, extendSessionService, loginUserService, logoutUserService, signupUserService } from "../../services/auth/authService.ts";

import { closeModal } from "./modalSlice.ts";
import { RootState } from "../store.ts";

enum AuthActionTypes {
    Signup = 'auth/signupUser',
    Login = 'auth/loginUser',
    Logout = 'auth/logoutUser',
    CheckAuth = 'auth/checkAuthentication',
    ExtendSession = 'auth/extendSession'
}

const sessionManager = {
    setAccount: (account: Account) => {
        sessionStorage.setItem('account', JSON.stringify(account));
    },
    setSessionEndTime: (sessionEndTime: number | string) => {
        sessionStorage.setItem('sessionEndTime', sessionEndTime.toString())
    },
    getAccount: (): Account | null => {
        const storedAccount: string | null = sessionStorage.getItem('account');
        if (!storedAccount || !isValidJson(storedAccount)) {
            return null;
        }
        return JSON.parse(storedAccount);
    },
    getSessionEndTime: (): number | null => {
        const storedSessionEndTime: string | null = sessionStorage.getItem('sessionEndTime')
        if (!storedSessionEndTime) {
            return null;
        }
        const sessionEndTime = parseInt(storedSessionEndTime);
        return sessionEndTime ? sessionEndTime : null;
    },
    clear: () => {
        sessionStorage.removeItem('account');
        sessionStorage.removeItem('sessionEndTime')
    }
}

const isValidJson = (str: string | null): boolean => {
    if (str === null) return false;
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

const initialState: AuthState = {
    account: sessionManager.getAccount(),
    isAuthenticated: false,
    loading: false,
    error: null,
    sessionEndTime: sessionManager.getSessionEndTime(),
}

const handleError = (error: any): ResponseError => ({
    message: error.response?.data?.message || 'Unexpected error...',
    statusCode: error.response?.status || 500,
    error: error.response.error || 'Error'
});

interface AccountActionPayload {
    account: Account;
    numSecondsRefreshTokenExpiresIn: number;
    isAuthenticated: boolean
}
export const signupUser = createAsyncThunk<AccountActionPayload, SignUpFormData, { rejectValue: ResponseError }>(
    AuthActionTypes.Signup,
    async (userData, { rejectWithValue }) => {
        try {
            return await signupUserService(userData);
        } catch (error: any) {
            return rejectWithValue(handleError(error));
        }
    }
);
export const loginUser = createAsyncThunk<AccountActionPayload, LogInFormData, { rejectValue: ResponseError }>(
    AuthActionTypes.Login,
    async (userData, { rejectWithValue }) => {
        try {
            return await loginUserService(userData);
        } catch (error: any) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const extendSession = createAsyncThunk<AccountActionPayload, { profileId: string }, { rejectValue: ResponseError }>(
    AuthActionTypes.ExtendSession,
    async ({ profileId }, { rejectWithValue }) => {
        try {
            return await extendSessionService(profileId)
        } catch (error: any) {
            return rejectWithValue(handleError(error))
        }
    }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: ResponseError }>(
    AuthActionTypes.Logout,
    async (_, { rejectWithValue }) => {
        sessionManager.clear();
        try {
            return await logoutUserService();
        } catch (error: any) {
            return rejectWithValue(handleError(error));
        }
    }
)

export const checkAuthentication = createAsyncThunk<AccountActionPayload, void, { state: RootState, rejectValue: ResponseError }>(
    AuthActionTypes.CheckAuth,
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const profileId = auth.account?.profileId;
            return await checkAuthService(profileId);
        } catch (error: any) {
            return rejectWithValue(handleError(error));
        }
    }
)

const setUserState = (state: AuthState, action: { payload: AccountActionPayload }) => {
    state.loading = false;
    state.account = action.payload?.account || null;
    state.isAuthenticated = !!action.payload;
    state.error = action.payload ? null : {
        message: 'Unexpected error - no payload on action...',
        statusCode: 500,
        error: 'Error'
    };
    const sessionEndTime = calculateSessionEndTime(action.payload.numSecondsRefreshTokenExpiresIn)
    state.sessionEndTime = sessionEndTime;
    sessionManager.setAccount(action.payload.account);
    sessionManager.setSessionEndTime(sessionEndTime)
};

const clearUserState = (state: AuthState) => {
    state.loading = false;
    state.account = null;
    state.isAuthenticated = false;
    state.sessionEndTime = null;

    sessionManager.clear();
}

const calculateSessionEndTime = (numSecondsRefreshTokenExpiresIn: number): number => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return currentTime + numSecondsRefreshTokenExpiresIn;
}

const setLoadingState = (state: AuthState) => {
    state.loading = true;
    state.error = null;
}
const setRejectedState = (state: AuthState, action: { payload?: ResponseError }, actionType: string) => {
    state.loading = false;
    state.error = action.payload || {
        message: `${actionType} Failed`,
        statusCode: 500,
        error: 'Error'
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
            .addCase(logoutUser.fulfilled, clearUserState)
            .addCase(logoutUser.rejected, (state, action) => {
                setRejectedState(state, action, 'Logout')
                clearUserState(state);
            })
            .addCase(closeModal, (state) => {
                state.error = null;
            })
            .addCase(checkAuthentication.pending, setLoadingState)
            .addCase(checkAuthentication.fulfilled, (state, action) => {
                if (action.payload.isAuthenticated == true) {
                    setUserState(state, action)
                }
                else {
                    clearUserState(state);
                }
            })
            .addCase(checkAuthentication.rejected, clearUserState)
            .addCase(extendSession.pending, setLoadingState)
            .addCase(extendSession.fulfilled, setUserState)
            .addCase(extendSession.rejected, (state, action) => setRejectedState(state, action, 'Extend Session'))
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;