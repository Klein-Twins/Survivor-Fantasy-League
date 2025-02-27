import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState } from '../../types/auth.ts';

import { closeModal } from './modalSlice.ts';
import authService from '../../services/auth/authService.ts';
import {
  Account,
  ApiError,
  ExtendSessionResponse,
  LoginUserRequestBody,
  SignupUserRequestBody,
  UserSession,
} from '../../../generated-api/index.ts';
import { ApiRequestParams } from '../../hooks/useApi.tsx';
import { AxiosResponse } from 'axios';

enum AuthActionTypes {
  Signup = 'auth/signupUser',
  Login = 'auth/loginUser',
  Logout = 'auth/logoutUser',
  CheckAuth = 'auth/checkAuthentication',
  ExtendSession = 'auth/extendSession',
}

const sessionManager = {
  setAccount: (account: Account) => {
    sessionStorage.setItem('account', JSON.stringify(account));
  },
  setSessionEndTime: (sessionEndTime: number | string) => {
    sessionStorage.setItem('sessionEndTime', sessionEndTime.toString());
  },
  getAccount: (): Account | null => {
    const storedAccount: string | null = sessionStorage.getItem('account');
    if (!storedAccount || !isValidJson(storedAccount)) {
      return null;
    }
    return JSON.parse(storedAccount);
  },
  getSessionEndTime: (): number | null => {
    const storedSessionEndTime: string | null =
      sessionStorage.getItem('sessionEndTime');
    if (!storedSessionEndTime) {
      return null;
    }
    const sessionEndTime = parseInt(storedSessionEndTime);
    return sessionEndTime ? sessionEndTime : null;
  },
  clear: () => {
    sessionStorage.removeItem('account');
    sessionStorage.removeItem('sessionEndTime');
  },
};

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
};

const handleError = (error: any): ApiError => ({
  message: error.response?.data?.message || 'Unexpected error...',
  statusCode: error.response?.status || 500,
  error: error.response.error || 'Error',
  success: false,
});

interface AccountActionPayload {
  account: Account;
  userSession: UserSession;
}
export const signupUser = createAsyncThunk<
  AccountActionPayload,
  ApiRequestParams<SignupUserRequestBody, void>,
  { rejectValue: ApiError }
>(AuthActionTypes.Signup, async (userData, { rejectWithValue }) => {
  try {
    const response = await authService.signupUser(userData);
    if (
      !response.data.responseData ||
      !response.data.responseData.account ||
      !response.data.responseData.userSession
    ) {
      throw new Error('Invalid response data: Failed to signup User');
    }
    const payload: AccountActionPayload = {
      account: response.data.responseData.account,
      userSession: response.data.responseData.userSession,
    };
    return payload;
  } catch (error: any) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data as ApiError);
    }
    return rejectWithValue({
      error: 'Unknown Error',
      message: 'An unexpected error occurred',
      statusCode: 500,
      success: false,
    });
  }
});
export const loginUser = createAsyncThunk<
  AccountActionPayload,
  ApiRequestParams<LoginUserRequestBody, void>,
  { rejectValue: ApiError }
>(AuthActionTypes.Login, async (userData, { rejectWithValue }) => {
  try {
    const response = await authService.loginUser(userData);
    if (
      !response ||
      !response.responseData?.account ||
      !response.responseData.userSession
    ) {
      throw new Error('Invalid response data: Failed to login User');
    }
    const payload: AccountActionPayload = {
      account: response.responseData.account,
      userSession: response.responseData.userSession,
    };
    return payload;
  } catch (error: any) {
    return rejectWithValue(handleError(error));
  }
});

export const extendSession = createAsyncThunk<
  AccountActionPayload,
  void,
  { rejectValue: ApiError }
>(AuthActionTypes.ExtendSession, async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<ExtendSessionResponse> =
      await authService.extendSession();
    if (
      !response ||
      !response.data ||
      !response.data.responseData?.account ||
      !response.data.responseData.userSession
    ) {
      throw new Error('Invalid response data: Failed to login User');
    }
    const payload: AccountActionPayload = {
      account: response.data.responseData.account,
      userSession: response.data.responseData.userSession,
    };
    return payload;
  } catch (error: any) {
    return rejectWithValue(handleError(error));
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: ApiError }
>(AuthActionTypes.Logout, async (_, { rejectWithValue }) => {
  sessionManager.clear();
  try {
    await authService.logoutUser();
    return;
  } catch (error: any) {
    return rejectWithValue(handleError(error));
  }
});

// export const checkAuthentication = createAsyncThunk<AccountActionPayload, void, { state: RootState, rejectValue: ApiError }>(
//     AuthActionTypes.CheckAuth,
//     async (_, { getState, rejectWithValue }) => {
//         try {
//             const { auth } = getState();
//             const profileId = auth.account?.profileId;
//             return await checkAuthService(profileId);
//         } catch (error: any) {
//             return rejectWithValue(handleError(error));
//         }
//     }
// )

const setUserState = (
  state: AuthState,
  action: { payload: AccountActionPayload }
) => {
  state.loading = false;
  state.account = action.payload?.account || null;
  state.isAuthenticated = !!action.payload;
  state.error = action.payload
    ? null
    : {
        success: false,
        message: 'Unexpected error - no payload on action...',
        statusCode: 500,
        error: 'Error',
      };
  const sessionEndTime = calculateSessionEndTime(
    action.payload.userSession.numSecondsRefreshTokenExpiresIn
  );
  console.log('In redux - calculated Session End Time: ', sessionEndTime);
  state.sessionEndTime = sessionEndTime;
  sessionManager.setAccount(action.payload.account);
  sessionManager.setSessionEndTime(sessionEndTime);
};

const clearUserState = (state: AuthState) => {
  state.loading = false;
  state.account = null;
  state.isAuthenticated = false;
  state.sessionEndTime = null;

  sessionManager.clear();
};

const calculateSessionEndTime = (
  numSecondsRefreshTokenExpiresIn: number
): number => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return currentTime + numSecondsRefreshTokenExpiresIn;
};

const setLoadingState = (state: AuthState) => {
  state.loading = true;
  state.error = null;
};
const setRejectedState = (
  state: AuthState,
  action: { payload?: ApiError },
  actionType: string
) => {
  state.loading = false;
  state.error = action.payload || {
    success: false,
    message: `${actionType} Failed`,
    statusCode: 500,
    error: 'Error',
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.account = null;
      state.isAuthenticated = false;
      state.error = null;
      sessionManager.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      //Sign up action
      .addCase(signupUser.pending, setLoadingState)
      .addCase(signupUser.fulfilled, setUserState)
      .addCase(signupUser.rejected, (state, action) =>
        setRejectedState(state, action, 'Signup')
      )
      //Log in action
      .addCase(loginUser.pending, setLoadingState)
      .addCase(loginUser.fulfilled, setUserState)
      .addCase(loginUser.rejected, (state, action) =>
        setRejectedState(state, action, 'Login')
      )
      //Log out action
      .addCase(logoutUser.pending, setLoadingState)
      .addCase(logoutUser.fulfilled, clearUserState)
      .addCase(logoutUser.rejected, (state, action) => {
        setRejectedState(state, action, 'Logout');
        clearUserState(state);
      })
      .addCase(closeModal, (state) => {
        state.error = null;
      })
      // .addCase(checkAuthentication.pending, setLoadingState)
      // .addCase(checkAuthentication.fulfilled, (state, action) => {
      //     if (action.payload.isAuthenticated == true) {
      //         setUserState(state, action)
      //     }
      //     else {
      //         clearUserState(state);
      //     }
      // })
      // .addCase(checkAuthentication.rejected, clearUserState)
      .addCase(extendSession.pending, setLoadingState)
      .addCase(extendSession.fulfilled, setUserState)
      .addCase(extendSession.rejected, (state, action) =>
        setRejectedState(state, action, 'Extend Session')
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
