import winston from 'winston';
import morgan from 'morgan';
import { NODE_ENV } from './config';

// Define custom levels and colors for the logger
const levels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 5,
    apiOp: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
    apiOp: 'green',
  },
};

Error.stackTraceLimit = 100;

const getCallerDetails = (): string => {
  const stack = new Error().stack;
  if (!stack) return 'Unknown location';

  // The first two lines in the stack trace are the error creation and the logger call.
  const stackLines = stack.split('\n');

  const srcLines = stackLines.reduce((acc: number[], line, index) => {
    if (line.includes('/src/')) {
      acc.push(index); // Collect the index of lines containing 'src'
    }
    return acc;
  }, []);

  if (srcLines.length === 0) return 'Unknown Location';

  const callerLine = stackLines[srcLines[2]]; // Adjust based on actual location in your stack trace

  // Adjusted regex to handle both cases
  const matches = callerLine.match(
    /at (.+?) \((.+):(\d+):(\d+)\)|at (.+):(\d+):(\d+)/
  );

  if (matches) {
    // Case 1: When function name is present
    if (matches[1] && matches[2] && matches[3]) {
      const functionName = matches[1]; // The function name
      const file = matches[2]; // The file name
      const lineNumber = matches[3]; // The line number

      // Extract the path after `src/`, and remove the `.ts` extension
      const relativeFilePath =
        file.split('src/')[1]?.replace('.ts', '') || file;

      return `${relativeFilePath}.${functionName}:${lineNumber}`;
    }
    // Case 2: When only file and line number are available (no function name)
    else if (matches[5] && matches[6]) {
      const file = matches[5]; // The file name
      const lineNumber = matches[6]; // The line number

      // Extract the path after `src/`, and remove the `.ts` extension
      const relativeFilePath =
        file.split('src/')[1]?.replace('.ts', '') || file;

      return `${relativeFilePath}:${lineNumber}`;
    }
  }

  return 'Unknown location';
};

const customTimestamp = winston.format.printf(({ timestamp }) => {
  // Use a simple date format: YYYY-MM-DD HH:mm:ss
  const date = new Date(Date.now());
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;
  return formattedDate;
});

const winstonLogger = winston.createLogger({
  level: NODE_ENV === 'development' ? 'debug' : 'info',
  levels: levels.levels,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message }) => {
          // Format timestamp as YYYY-MM-DD HH:mm:ss
          const date = new Date(Date.now());
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date
            .getDate()
            .toString()
            .padStart(2, '0')} ${date
            .getHours()
            .toString()
            .padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${date
            .getSeconds()
            .toString()
            .padStart(2, '0')}`;

          //const callerDetails = getCallerDetails();

          // Return the formatted log message
          //return `${formattedDate} : ${level}: ${message}\n\x1b[90mLocation: [${callerDetails}]\x1b[0m`;
          return `${formattedDate} : ${level}: ${message}`;
        })
      ),
    }),
  ],
});

// Add colors to the console log
winston.addColors(levels.colors);

interface CustomLogger extends winston.Logger {
  apiOp: (message: string) => void;
  db: (message: string) => void;
}

const logger = winstonLogger as CustomLogger;

logger.apiOp = (message: string) => {
  logger.log('apiOp', message); // Use the custom level 'apiOp'
};

logger.db = (message: string) => {
  logger.log('db', message); // Use the custom level 'db'
};

export default logger;
