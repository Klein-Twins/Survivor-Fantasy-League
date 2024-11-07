// services/auth/tokenService.ts
import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import errorFactory from '../../utils/errorFactory';
dotenv.config();
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const blacklistedTokens = new Set<string>();

const tokenService = {
    generateToken : (payload: JwtPayload): string => {
        return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRATION });
    },
    verifyToken : (token: string): JwtPayload => {
        if (blacklistedTokens.has(token)) throw errorFactory({message: 'Token Blacklisted', statusCode: 401})
        return jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayload;
    },
    blacklistToken : (token: string): void => {
        blacklistedTokens.add(token);
    },
}

export default tokenService;