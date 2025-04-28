import { NextFunction, Request, Response } from 'express';
import {
  LoginUserResponse,
  LogoutUserResponse,
  SignupUserResponse,
} from '../../generated-api';
import { AuthService } from '../../services/account/AuthService';
import { UserSession } from '../../domain/account/UserSession';
import authControllerHelper from './authControllerHelper';
import { NODE_ENV } from '../../config/config';

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
  const { email, password, userName, firstName, lastName } = req.body;
  try {
    authControllerHelper.validateSignupRequest(
      email,
      password,
      userName,
      firstName,
      lastName
    );
    const userSession: UserSession = await AuthService.signup({
      email,
      password,
      userName,
      firstName,
      lastName,
    });
    const response: SignupUserResponse = {
      statusCode: 201,
      message: 'Account created successfully',
      success: true,
      responseData: {
        account: userSession.getAccount().toDTO(),
        userSession: userSession.toDTO(),
      },
    };

    res.cookie('accessToken', userSession.getAccessToken()?.getToken(), {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.cookie('refreshToken', userSession.getRefreshToken()?.getToken(), {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { email, password } = req.body;
  try {
    const loginRequestData = authControllerHelper.validateLoginRequest(
      email,
      password
    );

    const userSession: UserSession = await AuthService.login(loginRequestData);

    const response: LoginUserResponse = {
      statusCode: 200,
      message: 'Login successful',
      success: true,
      responseData: {
        account: userSession.getAccount().toDTO(),
        userSession: userSession.toDTO(),
      },
    };

    res.cookie('accessToken', userSession.getAccessToken()?.getToken(), {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.cookie('refreshToken', userSession.getRefreshToken()?.getToken(), {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const accessToken = req.cookies['accessToken'];
  const refreshToken = req.cookies['refreshToken'];
  try {
    authControllerHelper.validateLogoutRequest(accessToken, refreshToken);

    const userSession: UserSession = await AuthService.logout({
      accessToken,
      refreshToken,
    });

    const response: LogoutUserResponse = {
      statusCode: 200,
      message: 'Logout successful',
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
