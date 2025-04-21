import { NextFunction, Request, Response } from 'express';
import {
  Account,
  ApiResponse,
  CheckAuthResponse,
  CheckAuthResponseData,
  ExtendSessionResponse,
  ExtendSessionResponseData,
  LoginUserRequestBody,
  LoginUserResponse,
  LoginUserResponseData,
  SignupUserRequestBody,
  SignupUserResponse,
  SignupUserResponseData,
} from '../../generated-api';
import { CustomError, UnauthorizedError } from '../../utils/errors/errors';
import userService from '../../servicesBackup/account/userService';
import userSessionService from '../../servicesBackup/auth/userSessionService';
import { UUID } from 'crypto';
import accountService from '../../servicesBackup/account/accountService';

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
    const reqBody = req.body;

    const account = await userService.signup({
      email: reqBody.email,
      password: reqBody.password,
      userName: reqBody.userName,
      firstName: reqBody.firstName,
      lastName: reqBody.lastName,
    });

    const userSession = await userSessionService.createUserSession(
      {
        userId: account.userId as UUID,
        profileId: account.profileId as UUID,
        accountRole: account.accountRole,
      },
      res
    );

    const responseData: SignupUserResponseData = {
      userSession,
      account,
    };

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

    let account: Account;
    try {
      account = await userService.login({
        email: reqBody.email,
        password: reqBody.password,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw new UnauthorizedError('Invalid email or password');
      }
      throw error;
    }

    const userSession = await userSessionService.createUserSession(
      {
        userId: account.userId as UUID,
        profileId: account.profileId as UUID,
        accountRole: account.accountRole,
      },
      res
    );

    const responseData: LoginUserResponseData = {
      userSession,
      account,
    };

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

    await userService.logout();

    await userSessionService.endUserSession(tokens, false, res);

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

    const userSession = await userSessionService.extendSession(tokens, res);

    const responseData: ExtendSessionResponseData = {
      userSession,
    };

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

    const userSession = await userSessionService.checkAuthSession(
      req.params.userId as UUID,
      tokens,
      res
    );

    let account: Account | undefined = undefined;
    if (userSession.isAuthenticated) {
      account = await accountService.getAccount(
        'userId',
        req.params.userId as UUID
      );
    }

    const responseData: CheckAuthResponseData = {
      account,
      userSession,
    };

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
