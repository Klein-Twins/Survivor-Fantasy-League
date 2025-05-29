import { NextFunction, Request, Response } from 'express';
import {
  LoginUserResponse,
  LogoutUserResponse,
  SignupUserResponse,
} from '../../generated-api';
import { AuthService } from '../../services/account/AuthService';
import authControllerHelper from './authControllerHelper';
import { NODE_ENV } from '../../config/config';
import { container } from 'tsyringe';
import { logApiRequestOnReceival } from '../../utils/api/requestReceivedLogging';
import logger from '../../config/logger';
import {
  CustomError,
  InternalServerError,
  UnauthorizedError,
} from '../../utils/errors/errors';

const authController = {
  signup,
  login,
  logout,
};

async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log('Received signup request');
  logApiRequestOnReceival('Signup', req);
  const { email, password, userName, firstName, lastName } = req.body;
  try {
    authControllerHelper.validateSignupRequest(
      email,
      password,
      userName,
      firstName,
      lastName
    );
    const authService = container.resolve(AuthService);
    const { account, userSession } = await authService.signup({
      email,
      password,
      userName,
      firstName,
      lastName,
    });

    if (!userSession) {
      throw new Error(
        'Failed to start userSession. Account was created. Please try logging in again'
      );
    }

    const response: SignupUserResponse = {
      statusCode: 201,
      message: 'Account created successfully',
      success: true,
      responseData: {
        account: account.toDTO(),
        userSession: userSession.toDTO(),
      },
    };

    const accessToken = userSession.getActiveAccessToken();
    if (!accessToken) {
      throw new Error(
        'Failed to create access token. Please try logging in again'
      );
    }
    const refreshToken = userSession.getActiveRefreshToken();
    if (!refreshToken) {
      throw new Error(
        'Failed to create refresh token. Please try logging in again'
      );
    }

    res.cookie('accessToken', accessToken.getToken(), {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.cookie('refreshToken', refreshToken.getToken(), {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });

    logger.debug('AccessToken: ' + accessToken.getToken());
    logger.debug('RefreshToken: ' + refreshToken.getToken());
    console.log('Sending login response');
    res.status(201).json(response);
  } catch (error) {
    console.log('Error during signup');
    next(error);
  }
}

async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  logApiRequestOnReceival('Login', req);
  const { email, password } = req.body;
  try {
    const loginRequestData = authControllerHelper.validateLoginRequest(
      email,
      password
    );

    const authService = container.resolve(AuthService);
    const { userSession, account } = await authService.login(loginRequestData);

    const response: LoginUserResponse = {
      statusCode: 200,
      message: 'Login successful',
      success: true,
      responseData: {
        account: userSession.getAccount().toDTO(),
        userSession: userSession.toDTO(),
      },
    };

    const accessToken = userSession.getActiveAccessToken();
    if (!accessToken) {
      throw new Error(
        'Failed to create access token. Please try logging in again'
      );
    }
    const refreshToken = userSession.getActiveRefreshToken();
    if (!refreshToken) {
      throw new Error(
        'Failed to create refresh token. Please try logging in again'
      );
    }

    res.cookie('accessToken', accessToken.getToken(), {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.cookie('refreshToken', refreshToken.getToken(), {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });

    logger.debug('AccessToken: ' + accessToken.getToken());
    logger.debug('RefreshToken: ' + refreshToken.getToken());

    res.status(200).json(response);
  } catch (error) {
    if (
      error instanceof CustomError &&
      (error as CustomError).statusCode < 500
    ) {
      next(
        new UnauthorizedError(
          'Your torch has not been lit. Please check your credentials and try again, castaway.'
        )
      );
    }

    next(error);
  }
}

async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  logApiRequestOnReceival('Logout', req);
  const accessToken = req.cookies['accessToken'];
  const refreshToken = req.cookies['refreshToken'];
  try {
    authControllerHelper.validateLogoutRequest(accessToken, refreshToken);

    const authService = container.resolve(AuthService);
    const { userSession, account } = await authService.logout({
      accessToken,
      refreshToken,
    });

    const response: LogoutUserResponse = {
      statusCode: 200,
      message: 'Your torch has been extinguished for now...',
      success: true,
      responseData: {
        message: `Until your torch is lit again ${userSession
          .getAccount()
          .getUserName()}`,
      },
    };

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export default authController;
