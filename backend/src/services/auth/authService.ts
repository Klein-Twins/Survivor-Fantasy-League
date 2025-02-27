import { Response } from 'express';
import {
  Account,
  CheckAuthResponseData,
  ExtendSessionResponseData,
  LoginUserRequestBody,
  LoginUserResponseData,
  SignupUserRequestBody,
  SignupUserResponseData,
  UserSession,
} from '../../generated-api';
import authHelper from '../../helpers/auth/authHelper';
import accountService from './accountService';
import userSessionService from './userSessionService';
import tokenService from './tokenService';

const authService = {
  signup,
  login,
  logout,
  extendSession,
  checkAuth,
};

async function signup(
  requestData: SignupUserRequestBody,
  res: Response
): Promise<SignupUserResponseData> {
  //Validate and Format Request Data
  await authHelper.signup.validateSignupRequestData(requestData);
  const formattedRequestBody: SignupUserRequestBody =
    authHelper.signup.formatSignupRequestData(requestData);

  const account: Account = await accountService.createAccount(
    formattedRequestBody
  );

  const userSession: UserSession = await userSessionService.createUserSession(
    account,
    res
  );
  const responseData: SignupUserResponseData = {
    account,
    userSession,
  };
  return responseData;
}

async function login(
  requestData: LoginUserRequestBody,
  res: Response
): Promise<LoginUserResponseData> {
  //Validate and Format Request Data
  await authHelper.login.validateLoginRequestData(requestData);
  const formattedRequestBody: LoginUserRequestBody =
    authHelper.login.formatLoginRequestData(requestData);

  const account: Account = await accountService.getAccount(
    formattedRequestBody.email,
    'email'
  );

  const userSession: UserSession = await userSessionService.createUserSession(
    account,
    res
  );

  const responseData: LoginUserResponseData = {
    account,
    userSession,
  };
  return responseData;
}

async function logout(tokens: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> {}

async function extendSession(
  tokens: {
    accessToken: string;
    refreshToken: string;
  },
  res: Response
): Promise<ExtendSessionResponseData> {
  await userSessionService.endCurrentUserSession(
    res,
    tokens.accessToken,
    tokens.refreshToken
  );

  const account = await accountService.getAccount(
    (
      await tokenService.decodeToken(tokens.refreshToken)
    ).userId,
    'userId'
  );

  const userSession: UserSession = await userSessionService.createUserSession(
    account,
    res
  );

  const responseData: ExtendSessionResponseData = {
    account,
    userSession,
  };

  return responseData;
}

async function checkAuth(
  tokens: {
    accessToken: string;
    refreshToken: string;
  },
  res: Response
): Promise<CheckAuthResponseData> {
  authHelper.checkAuth.validateCheckAuthRequestData(tokens);

  const userSession: UserSession =
    await userSessionService.getCurrentUserSession(
      tokens.accessToken,
      tokens.refreshToken
    );

  if (!userSession.isAuthenticated) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    userSessionService.endCurrentUserSession(
      res,
      tokens.accessToken,
      tokens.refreshToken
    );

    return {
      userSession: {
        isAuthenticated: false,
      },
    };
  } else {
    const account = await accountService.getAccount(
      (
        await tokenService.decodeToken(tokens.refreshToken)
      ).userId,
      'userId'
    );
    return {
      account,
      userSession,
    };
  }
}

export default authService;
