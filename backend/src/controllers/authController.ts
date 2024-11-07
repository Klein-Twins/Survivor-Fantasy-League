import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import loginService from '../services/auth/loginService';
import { AuthLoginResponseData, loginFields } from '../types/auth';
import errorFactory from '../utils/errorFactory';
import { validateEmail } from '../utils/auth/validateAuthRequest';
import signupService from '../services/auth/signupService';
import { AuthSignupResponseData, signupFields } from '../types/auth';
import { isValidName } from '../utils/auth/validateName';
import { isPasswordStrong } from '../services/auth/passwordHelper';
import logoutService from '../services/auth/logoutService';
import { AuthController } from '../types/auth';

dotenv.config();

const authController : AuthController = {
    login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password } = req.body;
        const requestData: loginFields = {
            email: email.toLowerCase(), password
        }

        try {
            validateLoginRequestData(requestData);
            const responseData: AuthLoginResponseData = await loginService.login(requestData);

            res.set('Authorization', `Bearer ${responseData.token}`)
                .status(responseData.statusCode)
                .json({ message: responseData.message, user: responseData.user });
        } catch (error) {
            next(error);
        }

    },
    signup: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { username, password, firstName, lastName, email } = req.body;
        const requestData: signupFields = {
            username, password, firstName, lastName, email: email.toLowerCase()
        };

        try {
            validateSignupData(requestData);
            const responseData: AuthSignupResponseData = await signupService(requestData);
            res.set('Authorization', `Bearer ${responseData.token}`)
                .status(responseData.statusCode)
                .json({ message: responseData.message, user: responseData.user });
        } catch (error) {
            next(error);
        }

    },
    logout:  async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
        const token = req.headers.authorization?.split(' ')[1];    
        
        try {
            if (!token) throw errorFactory({message:"Token is required", statusCode: 401});
            const result = logoutService.logout(token);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }

    },
};

export default authController;

const validateLoginRequestData = (fields: loginFields) => {
    if (!fields.email || fields.email.length === 0) throw errorFactory({ message: 'Missing email', statusCode: 400 });
    if (!validateEmail(fields.email)) throw errorFactory({ message: 'Invalid Email', statusCode: 400 });
    if (!fields.password || fields.password.length === 0) throw errorFactory({ message: 'Missing password', statusCode: 400 })
}

const validateSignupData = async ({ email, username, password, firstName, lastName }: signupFields) => {
    if (!email || email.length === 0) throw errorFactory({ message: 'Missing email', statusCode: 400 });
    if (!password || password.length === 0) throw errorFactory({ message: 'Missing password', statusCode: 400 });
    if (!username || username.length === 0) throw errorFactory({ message: 'Missing username', statusCode: 400 });
    if (firstName && !isValidName(firstName)) throw errorFactory({ message: 'Invalid first name: only letters and spaces allowed', statusCode: 400 });
    if (lastName && !isValidName(lastName)) throw errorFactory({ message: 'Invalid last name: only letters and spaces allowed', statusCode: 400 });
    if (!validateEmail(email)) throw errorFactory({ message: 'Invalid email', statusCode: 400 });
    if (!isPasswordStrong(password)) throw errorFactory({ message: 'Password is too weak', statusCode: 400 });
};
