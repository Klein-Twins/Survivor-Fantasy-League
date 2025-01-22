import { Request, Response, NextFunction } from 'express';
import { Account, SignupUserRequestBody } from '../../src/generated-api';
import authController from '../../src/controllers/auth/authController';
import accountService from '../../src/servicesAndHelpers/auth/accountService';
import userSessionService from '../../src/servicesAndHelpers/userSessionService';
import authControllerHelper from '../../src/controllers/auth/authControllerHelper';

jest.mock('../../src/servicesAndHelpers/auth/accountService');
jest.mock('../../src/servicesAndHelpers/userSessionService');
jest.mock('../../src/controllers/auth/authControllerHelper');

describe('AuthController - Signup', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    const mockSignupData: SignupUserRequestBody = {
        email: 'test@example.com',
        password: 'Password123!',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User'
    };

    const mockAccount: Account = {
        userId: '123',
        profileId: '456',
        ...mockSignupData
    };

    const mockSessionData = {
        userSession: {
            isAuthenticated: true,
            numSecondsRefreshTokenExpiresIn: 3600
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
    };

    beforeEach(() => {
        mockRequest = {
            body: mockSignupData
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            cookie: jest.fn()
        };
        nextFunction = jest.fn();

        // Reset all mocks
        jest.clearAllMocks();

        // Setup default mock implementations
        (authControllerHelper.validateSignupRequestData as jest.Mock).mockImplementation(() => true);
        (authControllerHelper.formatSignupRequestData as jest.Mock).mockReturnValue(mockSignupData);
        (accountService.createAccount as jest.Mock).mockResolvedValue(mockAccount);
        (userSessionService.createSessionAndTokens as jest.Mock).mockResolvedValue(mockSessionData);
        (userSessionService.attachTokenToResponse as jest.Mock).mockImplementation(() => { });
    });

    it('should successfully create account and return response', async () => {
        await authController.signup(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(accountService.createAccount).toHaveBeenCalledWith(mockSignupData);
        expect(userSessionService.createSessionAndTokens).toHaveBeenCalledWith(mockAccount);
        expect(userSessionService.attachTokenToResponse).toHaveBeenCalledTimes(2);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            account: mockAccount,
            userSession: mockSessionData.userSession
        });
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should handle validation failure', async () => {
        const validationError = new Error('Invalid data');
        (authControllerHelper.validateSignupRequestData as jest.Mock)
            .mockImplementation(() => { throw validationError; });

        await authController.signup(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(accountService.createAccount).not.toHaveBeenCalled();
        expect(nextFunction).toHaveBeenCalledWith(validationError);
    });

    it('should handle account creation failure', async () => {
        (accountService.createAccount as jest.Mock).mockResolvedValue(null);

        await authController.signup(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 500
            })
        );
        expect(userSessionService.createSessionAndTokens).not.toHaveBeenCalled();
    });

    it('should handle session creation failure', async () => {
        const sessionError = new Error('Session creation failed');
        (userSessionService.createSessionAndTokens as jest.Mock)
            .mockRejectedValue(sessionError);

        await authController.signup(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(sessionError);
        expect(mockResponse.json).not.toHaveBeenCalled();
    });
});