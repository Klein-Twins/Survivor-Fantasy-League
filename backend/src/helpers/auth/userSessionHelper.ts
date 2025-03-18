import { UserSession } from '../../generated-api';
import tokenHelper from './tokenHelper';

const userSessionHelper = {
  buildUserSession,
};

function buildUserSession(refreshToken?: string): UserSession {
  if (!refreshToken) {
    return {
      isAuthenticated: false,
    };
  }

  return {
    isAuthenticated: true,
    numSecondsRefreshTokenExpiresIn:
      tokenHelper.getNumSecondsTokenIsValid(refreshToken),
  };
}

export default userSessionHelper;
