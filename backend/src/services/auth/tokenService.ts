import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotenv.config();

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const blacklistedTokens = new Set<string>();

interface UserPayload extends JwtPayload {
    user: string;
}

const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(
        {
            ...payload,
            iat: Math.floor(Date.now() / 1000),
        },
        JWT_SECRET as jwt.Secret,
        { expiresIn: JWT_EXPIRATION }
    );
};

const verifyToken = (token: string): UserPayload => {
    return jwt.verify(token, JWT_SECRET as jwt.Secret) as UserPayload;
};

const blacklistToken = (token: string): void => {
    blacklistedTokens.add(token);
};

const isTokenBlacklisted = (token: string): boolean => {
    return blacklistedTokens.has(token);
};

export { generateToken, verifyToken, blacklistToken, isTokenBlacklisted, UserPayload };