import winston from 'winston';
import { NODE_ENV } from './config';
import path from 'path';

const logLevels = { 
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const srcDir = path.resolve(__dirname, 'src');

const getCallerFile = (): string => {
    const caller = module.parent;
    if (caller && caller.filename) {
        const projectRoot = path.join(process.cwd(), 'src');
        let relativePath = path.relative(projectRoot, caller.filename);

        // Remove the `src` folder from the path if it exists at the beginning
        if (!relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
            return relativePath; // Already excludes `src` directory
        }

        return `unknown source`;
    }
    return 'unknown source';
};

const level = () => {
    const env = NODE_ENV;
    return env === 'development' ? 'debug' : 'info';
}

const customFormat = winston.format.printf(({ timestamp, level, message }) => {
    const filename = getCallerFile();
    return `${timestamp} [${filename}] ${level}: ${message}`;
});

const transports = [
    new winston.transports.Console({
        format: winston.format.colorize({ all: true }),
    })
];

const logger = winston.createLogger({
    level: level(),
    levels: logLevels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
    ),
    transports: transports,
});

export default logger;