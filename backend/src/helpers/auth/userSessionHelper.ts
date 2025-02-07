import { UserSession } from '../../generated-api';
import { TokenAttributes } from '../../models/account/Tokens';
import tokenService from '../../services/auth/tokenService';
import tokenHelper from './tokenHelper';

const userSessionHelper = {
  buildUserSession,
};

async function buildUserSession(
  refreshToken?: TokenAttributes['token']
): Promise<UserSession> {
  if (
    !refreshToken ||
    !(await tokenService.verifyToken(refreshToken, 'refresh'))
  ) {
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
