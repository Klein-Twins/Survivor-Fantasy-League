import { RequestHandler } from 'express';
import login from './auth/login';
import signup from './auth/signup';
import changePassword from './auth/changePassword';
import logout from './auth/logout';

interface AuthController {
    login: RequestHandler;
    signup: RequestHandler;
    changePassword: RequestHandler;
    logout: RequestHandler;
}

const authController: AuthController = {
    login,
    signup,
    changePassword,
    logout,
};

export default authController;