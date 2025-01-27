import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'APP_HOST',
  'APP_PORT',
  'APP_PROTOCOL',
  'NODE_ENV',

  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_BUCKET_NAME',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
});

export const DB_NAME = process.env.DB_NAME!;
export const DB_HOST = process.env.DB_HOST!;
export const DB_PORT = parseInt(process.env.DB_PORT!, 10);
export const DB_USERNAME = process.env.DB_USERNAME!;
export const DB_PASSWORD = process.env.DB_PASSWORD!;

export const NODE_ENV = process.env.NODE_ENV!;

export const APP_HOST = process.env.APP_HOST!;
export const APP_PORT = process.env.APP_PORT!;
export const APP_PROTOCOL = process.env.APP_PROTOCOL!;

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
export const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '5m';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '1h';

export const AWS_REGION = process.env.AWS_REGION!;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
