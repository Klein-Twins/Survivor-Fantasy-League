import {
  LoginUserRequestBody,
  SignupUserRequestBody,
} from '../../generated-api';
import { UnauthorizedError } from '../../utils/errors/errors';
import passwordHelper from './passwordHelper';
import userHelper from './userHelper';

const authHelper = {
  signup: {
    formatSignupRequestData,
    validateSignupRequestData,
  },
  login: {
    validateLoginRequestData,
    formatLoginRequestData,
  },
  extendSession: {
    validateExtendSessionRequestData,
  },
  checkAuth: {
    validateCheckAuthRequestData,
  },
};

function validateCheckAuthRequestData(tokens: {
  accessToken?: string;
  refreshToken: string;
}): void {
  validateRefreshToken(tokens.refreshToken);
}

function validateRefreshToken(refreshToken: string): void {
  if (!refreshToken) {
    throw new UnauthorizedError('Missing refresh token');
  }
}

function validateExtendSessionRequestData(tokens: {
  accessToken?: string;
  refreshToken: string;
}): void {
  validateRefreshToken(tokens.refreshToken);
}

function formatSignupRequestData(
  signupData: SignupUserRequestBody
): SignupUserRequestBody {
  return {
    ...signupData,
    email: signupData.email.toLowerCase(),
  };
}

function formatLoginRequestData(
  loginRequestData: LoginUserRequestBody
): LoginUserRequestBody {
  return {
    ...loginRequestData,
    email: loginRequestData.email.toLowerCase(),
  };
}

async function validateSignupRequestData(
  signupData: SignupUserRequestBody
): Promise<void> {
  await userHelper.validateEmail(signupData.email);
  await userHelper.validateUserNameAndExists(signupData.username);
  passwordHelper.validatePassword(signupData.password);
}

async function validateLoginRequestData(
  loginRequestData: LoginUserRequestBody
): Promise<void> {
  await userHelper.validateEmail(loginRequestData.email);
  await passwordHelper.validatePassword(loginRequestData.password);
}

export default authHelper;
