import { NextFunction, Request, Response } from 'express';
import {
  ApiResponse,
  CheckAuthResponse,
  CheckAuthResponseData,
  ExtendSessionResponse,
  LoginUserRequestBody,
  LoginUserResponse,
  LoginUserResponseData,
  SignupUserRequestBody,
  SignupUserResponse,
  SignupUserResponseData,
} from '../../generated-api';
import authService from '../../services/auth/authService';
import { CustomError } from '../../utils/errors/errors';

const authController = {
  signup,
  login,
  logout,
  extendSession,
  checkAuth,
};

async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const reqBody: SignupUserRequestBody = req.body;

    //Call Auth Service to create response
    const responseData: SignupUserResponseData = await authService.signup(
      reqBody,
      res
    );

    //Format Response and send
    const response: SignupUserResponse = {
      success: true,
      responseData: responseData,
      message: 'User signed up successfully',
      statusCode: 200,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
    return;
  }
}

async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const reqBody: LoginUserRequestBody = req.body;

    //Call Auth Service to create response
    const responseData: LoginUserResponseData = await authService.login(
      reqBody,
      res
    );

    //Format Response and send
    const response: LoginUserResponse = {
      success: true,
      responseData: responseData,
      message: 'User logged in successfully',
      statusCode: 200,
    };
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
  try {
    const tokens: { accessToken: string; refreshToken: string } = {
      accessToken: req.cookies.accessToken,
      refreshToken: req.cookies.refreshToken,
    };
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    await authService.logout(tokens);

    const response: ApiResponse = {
      success: true,
      message: 'User logged out successfully',
      statusCode: 200,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function extendSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tokens: { accessToken: string; refreshToken: string } = {
      accessToken: req.cookies.accessToken,
      refreshToken: req.cookies.refreshToken,
    };

    const responseData = await authService.extendSession(tokens, res);

    const response: ExtendSessionResponse = {
      success: true,
      message: 'Session extended successfully',
      statusCode: 200,
      responseData: responseData,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tokens: { accessToken: string; refreshToken: string } = {
      accessToken: req.cookies.accessToken,
      refreshToken: req.cookies.refreshToken,
    };

    const responseData: CheckAuthResponseData = await authService.checkAuth(
      tokens,
      res
    );

    const response: CheckAuthResponse = {
      success: true,
      message: responseData.userSession.isAuthenticated
        ? 'User is authenticated'
        : 'User is not authenticated',
      statusCode: 200,
      responseData: responseData,
    };
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      const response: CheckAuthResponse = {
        success: true,
        message: 'User is not authenticated',
        statusCode: 200,
        responseData: {
          userSession: {
            isAuthenticated: false,
            numSecondsRefreshTokenExpiresIn: 0,
          },
        },
      };
      res.status(200).json(response);
      return;
    }
    next(error);
  }
}

export default authController;
