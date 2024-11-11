import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'JWT_ACCESS_SECRET',
    'APP_HOST',
    'APP_PORT',
    'APP_PROTOCOL',
    'NODE_ENV'
]

requiredEnvVars.forEach((envVar) => {
    if(!process.env[envVar]) {
        throw new Error(`Missing environment variable: ${envVar}`);
    }
});


export const DB_NAME = process.env.DB_NAME!;
export const DB_HOST = process.env.DB_HOST!;
export const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
export const DB_USERNAME = process.env.DB_USERNAME!;
export const DB_PASSWORD = process.env.DB_PASSWORD!;

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const APP_HOST = process.env.APP_HOST!; 
export const APP_PORT = process.env.APP_PORT || 3000;
export const APP_PROTOCOL = process.env.APP_PROTOCOL || 'http';

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
export const JWT_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || "1h";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || "1h";