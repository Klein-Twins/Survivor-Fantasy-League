import { mock } from 'node:test';
import authService from '../../../src/servicesAndHelpersBackup/auth/authService';
import logoutService from '../../../src/servicesAndHelpersBackup/auth/logoutService';
import errorFactory from '../../../src/utils/errors/errorFactory';
import { UnauthorizedError } from '../../../src/utils/errors/errors';
import { AuthLogoutResponseData } from '../../../src/types/auth/authTypes';

jest.mock('../../../src/servicesAndHelpers/auth/authService');
jest.mock('../../../src/utils/errors/errorFactory');

describe('logoutService tests', () => {
  const mockToken = 'MockJwtToken';

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should throw a 401 error if token is not verified', () => {
    (authService.tokenService.verifyToken as jest.Mock).mockReturnValue(false);
    (errorFactory as jest.Mock).mockImplementation(() => {
      throw new UnauthorizedError('Session token invalid');
    });

    expect(() => logoutService.logout(mockToken)).toThrow(UnauthorizedError);
    expect(() => logoutService.logout(mockToken)).toThrow('Session token invalid');
    expect(authService.tokenService.verifyToken).toHaveBeenCalledWith(mockToken);
    expect(authService.tokenService.blacklistToken).not.toHaveBeenCalled();
  });

  it('should blacklist mock token if valid and logout is called', () => {
    (authService.tokenService.verifyToken as jest.Mock).mockReturnValue(true);

    const result: AuthLogoutResponseData = logoutService.logout(mockToken);

    expect(result).toEqual({
      message: 'Successfully logged out user',
      statusCode: 200,
    });
    expect(authService.tokenService.verifyToken).toHaveBeenCalledWith(mockToken);
    expect(authService.tokenService.blacklistToken).toHaveBeenCalledWith(mockToken);
  });
});
