import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotenv.config();
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRATION });
};