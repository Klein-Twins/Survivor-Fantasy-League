import { RequestHandler } from "express";

export interface APIResponseData {
    statusCode: number;
    message: string;
}

export interface AuthResponseData extends APIResponseData {
    user: {
        username: string;
        userProfileId: string;
    };
    token: string;
}

export interface AuthSignupResponseData extends AuthResponseData {}
export interface AuthLoginResponseData extends AuthResponseData {}
export interface AuthLogoutResponseData extends APIResponseData {}


export interface loginFields {
    email: string;
    password: string;
}

export interface signupFields {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthController {
    login: RequestHandler;
    signup: RequestHandler;
    logout: RequestHandler;
}