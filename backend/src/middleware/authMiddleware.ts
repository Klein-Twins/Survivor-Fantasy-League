import { Request, Response, NextFunction } from 'express';
import { verifyToken, isTokenBlacklisted, UserPayload } from '../services/auth/tokenService';

interface UserRequest extends Request {
    user?: UserPayload;
}

const authenticateToken = (req: UserRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || isTokenBlacklisted(token)) {
        res.status(403).send('Forbidden: Invalid or missing token');
        return;
    }

    try {
        const user = verifyToken(token); // Now typed as UserPayload
        req.user = user; // Attach user info to request
        next(); // Call the next middleware or route handler
    } catch (error) {
        res.status(403).send('Forbidden: Invalid token');
        return;
    }
};

export { authenticateToken };