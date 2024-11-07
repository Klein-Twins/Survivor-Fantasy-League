import userRepository from '../repositories/userRepository';
import errorFactory from '../utils/errorFactory';
import { loginFields, AuthLoginResponseData } from '../types/auth';
import responseFormatter from '../utils/auth/responseFormatter';
import { UserAttributes } from '../models/User';
import tokenService from './tokenService';
import userService from './userService';
import logoutService from './auth/logoutService';
import { AuthLogoutResponseData } from '../types/auth.ts';

import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
dotenv.config();
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const blacklistedTokens = new Set<string>();


const authService = {
    loginService: {
        login: async (fields: loginFields): Promise<AuthLoginResponseData> => {

            const userRecord: UserAttributes | null = await userRepository.findUserByEmail(fields.email);
            if (!userRecord) throw errorFactory({ message: "No account tied to email", statusCode: 404 })

            if (!await userService.authenticateUser(userRecord, fields.password)) throw errorFactory({ message: 'Incorrect password', statusCode: 401 });

            const token = tokenService.generateToken({ user: userRecord.USER_ID });

            return responseFormatter.formatLoginResponse(
                200,
                'User authenticated successfully',
                userRecord,
                token
            );
        }
    },
    logoutService: {
        logout: (token: string): AuthLogoutResponseData => {
            if (!tokenService.verifyToken(token)) throw errorFactory({ message: "Session token invalid", statusCode: 401 });
            tokenService.blacklistToken(token);
            return { message: 'Successfully logged out user', statusCode: 200 };
        }
    },

    tokenService: {
        generateToken: (payload: JwtPayload): string => {
            return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRATION });
        },
        verifyToken: (token: string): JwtPayload => {
            if (blacklistedTokens.has(token)) throw errorFactory({ message: 'Token Blacklisted', statusCode: 401 })
            return jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayload;
        },
        blacklistToken: (token: string): void => {
            blacklistedTokens.add(token);
        },
    },

    signupService: {

        signup: async (fields: signupFields): Promise<AuthSignupResponseData> => {

            if (await userRepository.findUserByEmail(fields.email)) throw errorFactory({ message: 'Email already tied to account', statusCode: 400 });
            if (await userRepository.findUserByUsername(fields.username)) throw errorFactory({ message: 'Username already tied to account', statusCode: 400 });

            const userRecord: UserAttributes = await userService.createUser(fields)

            const token: string = tokenService.generateToken({ user: userRecord.USER_ID });

            return responseFormatter.formatSignupResponse(
                201,
                'User created successfully',
                userRecord,
                token
            );
        }
    }


};

export default authService;