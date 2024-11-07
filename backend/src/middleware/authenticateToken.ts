import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import errorFactory from '../utils/errorFactory';
import {Request, Response, NextFunction } from 'express';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthenticatedRequest extends Request {
    user?: string | jwt.JwtPayload; // User payload can be a string or an object
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Get token from the 'Authorization' header (assumes "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(errorFactory({message: 'Access token required', statusCode: 401}))
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(errorFactory({ message: 'Invalid or expired token', statusCode: 403 }));
        }
        req.user = decoded;
        next();
    });
};

export default authenticateToken;