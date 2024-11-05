import { Request, RequestHandler, Response } from 'express';
import logoutService from '../../services/auth/logout';

const handleError = (res: Response, error: Error, statusCode: number) => {
    return res.status(statusCode).json({ message: error.message });
};

const logout : RequestHandler = async (req: Request, res: Response): Promise<void>  => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token is required' });
        return;
    }

    try {
        const result = await logoutService(token);
        res.status(200).json(result);
        return;
    } catch (error) {
        handleError(res, error as Error, 500);
        return;
    }
};

export default logout;