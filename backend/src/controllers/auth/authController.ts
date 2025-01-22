// External packages
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Internal services
import accountService from '../../servicesAndHelpers/auth/accountService';
import authService from '../../servicesAndHelpers/auth/authService';
import userSessionService from '../../servicesAndHelpers/userSessionService';

// Types
import {
    Account,
    ApiError,
    CheckAuthResponse,
    ExtendSessionResponse,
    LoginUserRequestBody,
    LogoutUserResponse,
    SignupUserRequestBody,
    SignupUserResponse,
    SignupUserResponseData,
    UserSession
} from '../../generated-api';
import { UserJwtPayload } from '../../types/auth/tokenTypes';

// Utilities
import logger from '../../config/logger';
import errorFactory from '../../utils/errors/errorFactory';
import { UnauthorizedError } from '../../utils/errors/errors';

import tokenService from '../../servicesAndHelpers/auth/tokenService';
import authControllerHelper from './authControllerHelper';

const authController = {
    signup,
    login,
    logout,
    extendSession,
    checkAuth
}

async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const reqBody: SignupUserRequestBody = req.body;

        authControllerHelper.validateSignupRequestData(reqBody);
        const reqBodyFormatted: SignupUserRequestBody = authControllerHelper.formatSignupRequestData(reqBody);

        const account: Account | null = await accountService.createAccount(reqBodyFormatted);
        if (!account) {
            const error: ApiError = {
                success: false,
                message: 'Failed to light your torch - try again later.',
                error: 'Internal Server Error',
                statusCode: 500
            }
            throw error;
        }

        const userSession: UserSession = await userSessionService.createUserSessionAndAttachTokensToResponse(account, res);

        const responseData: SignupUserResponseData = {
            account,
            userSession
        }

        res.status(200).json(responseData);
    } catch (error) {
        logger.error(`Error in accountController.signup: ${error}`);
        next(error);
    }
}

async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const reqBody: LoginUserRequestBody = req.body

        authControllerHelper.validateLoginRequestData(reqBody);
        const formattedLoginRequestData = authControllerHelper.formatLoginRequestData(reqBody);

        const account: Account | null = await accountService.getAccountByEmail(formattedLoginRequestData.email)
        if (!account) {
            throw errorFactory(new UnauthorizedError())
        }

        const isAuthenticated = await authService.authenticateAccount(account, formattedLoginRequestData.password);
        if (!isAuthenticated) {
            throw errorFactory(new UnauthorizedError());
        }

        const userSession: UserSession = await userSessionService.createUserSessionAndAttachTokensToResponse(account, res)


        const responseData: SignupUserResponseData = {
            account,
            userSession
        }

        const response: SignupUserResponse = {
            success: true,
            statusCode: 200,
            message: `Welcome to the island, ${account.firstName ? account.firstName : account.userName}.`,
            responseData
        }

        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error in accountController.login: ${error}`);
        next(error);
    }
}

async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const accessToken: string | undefined = req.cookies.accessToken;
        const refreshToken: string | undefined = req.cookies.refreshToken;
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        userSessionService.deleteSession({ accessToken, refreshToken });

        const response: LogoutUserResponse = {
            success: true,
            message: "User has been logged out.",
            statusCode: 200
        }

        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}

async function extendSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const refreshToken: string | undefined = req.cookies.refreshToken;

        if (!refreshToken) {
            const missingRefreshTokenError: ApiError = {
                success: false,
                message: 'Failed to extend session - missing refresh token.',
                error: 'Bad Request',
                statusCode: 400
            }
            res.status(400).json(missingRefreshTokenError)
            return;
        }

        const payload: UserJwtPayload = jwt.decode(refreshToken) as UserJwtPayload;

        const account: Account | null = await accountService.getAccountByUserId(payload.userId);

        if (!account) {
            const accountNotFoundError: ApiError = {
                success: false,
                message: 'Failed to extend session - account not found.',
                error: 'Not Found',
                statusCode: 404
            }
            res.status(404).json(accountNotFoundError);
            return;
        }

        const userSession: UserSession = await userSessionService.createUserSessionAndAttachTokensToResponse(account, res)

        const response: ExtendSessionResponse = {
            responseData: {
                account: account,
                userSession
            },
            statusCode: 200,
            message: "See you next tribal council.",
            success: true
        }

        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error refreshing tokens: ${error}`);
        next(error);
    }
}

async function checkAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const refreshToken: string | undefined = req.cookies.refreshToken;
    if (!refreshToken) {
        const response: CheckAuthResponse = {
            success: true,
            message: "User is not authenticated",
            statusCode: 200,
            responseData: {
                userSession: {
                    isAuthenticated: false
                }
            }
        };
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json(response);
        return;
    }

    try {
        const isRefreshTokenAuthenticated = await authService.authenticateToken(refreshToken, 'refresh');
        if (!isRefreshTokenAuthenticated) {
            const response: CheckAuthResponse = {
                success: true,
                statusCode: 200,
                message: 'Refresh token is not authenticated',
                responseData: {
                    userSession: {
                        isAuthenticated: false
                    }
                }
            }
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.status(200).json(response);
            return;
        }

        const refreshPayload: UserJwtPayload = jwt.decode(refreshToken) as UserJwtPayload;

        const account: Account | null = await accountService.getAccountByUserId(refreshPayload.userId);
        if (!account) {
            const response: CheckAuthResponse = {
                success: true,
                message: "User not found",
                statusCode: 200,
                responseData: {
                    userSession: {
                        isAuthenticated: false
                    }
                }
            };
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.status(200).json(response);
            return;
        }

        const userSession: UserSession = {
            isAuthenticated: true,
            numSecondsRefreshTokenExpiresIn: tokenService.getNumSecondsTokenIsValid(refreshToken)
        };

        const response: CheckAuthResponse = {
            success: true,
            statusCode: 200,
            message: 'User is authenticated',
            responseData: {
                account,
                userSession
            }
        };

        res.status(200).json(response);
        return;

    } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        next(error);
    }
}

export default authController;


