import { AxiosResponse } from 'axios';
import {
  CheckAuthResponse,
  ExtendSessionResponse,
  LoginUserRequestBody,
  LoginUserResponse,
  LogoutUserResponse,
  SignupUserRequestBody,
  SignupUserResponse,
} from '../../../generated-api';
import { ApiRequestParams } from '../../hooks/useApi';
import api from '../apiContainer';

const authService = {
  loginUser,
  signupUser,
  logoutUser,
  extendSession,
  checkAuth,
};

async function loginUser({
  body,
}: ApiRequestParams<LoginUserRequestBody, void>): Promise<
  AxiosResponse<LoginUserResponse>
> {
  const response = await api.userSessionServiceApi.loginUser(body, {
    withCredentials: true,
  });
  return response;
}

async function signupUser(
  params: ApiRequestParams<SignupUserRequestBody, void>
): Promise<AxiosResponse<SignupUserResponse>> {
  const response = await api.userSessionServiceApi.signupUser(params.body, {
    withCredentials: true,
  });
  return response;
}

async function logoutUser(): Promise<AxiosResponse<LogoutUserResponse>> {
  const response = await api.userSessionServiceApi.logoutUser({
    withCredentials: true,
  });
  return response;
}

async function extendSession(): Promise<AxiosResponse<ExtendSessionResponse>> {
  const response = await api.userSessionServiceApi.extendSession({
    withCredentials: true,
  });
  return response;
}

async function checkAuth(): Promise<AxiosResponse<CheckAuthResponse>> {
  const response = await api.userSessionServiceApi.checkAuth({
    withCredentials: true,
  });
  return response;
}

export default authService;
