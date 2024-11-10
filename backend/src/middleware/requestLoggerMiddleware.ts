import logger from "../config/logger";
import { Request, Response, NextFunction } from "express";

// Format the log with nice newlines and indentation for readability
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    const originalJson = res.json;
    let responseBody: any = null;

    res.json = (body: any) => {
        responseBody = body;
        return originalJson.call(res, body);
    }

    const essentialHeadersList = [
        'Authorization',
        'Content-Type',
        'User-Agent',
        'Accept',
        'Host',
        //'X-Request-ID',
        //'Cookie',
        //'X-Forwarded-For',
        //'X-Forwarded-Proto',
        //'X-Content-Type-Options',
        //'Cache-Control'
    ];

    // Format the log with nice newlines and indentation for readability
    const logMessage = `Request Received
------------------------------------------------------------------------------------------
        Request Method   : ${req.method}
        Request URL      : ${req.originalUrl}
        Request Headers  : {${essentialHeadersList.map((header) => `\n          ${header}: ${req.headers[header]}`)}
        }${req.body ? `
        Request Body     :${JSON.stringify(req.body, null, 2)
                .replace(/^\{/, '  {')  // Add 2 spaces before the opening brace
                .replace(/\}$/, '        }')  // Add 8 spaces before the closing brace
                .replace(/^(?=\s*".*":)/gm, '        ')}` : ''}
------------------------------------------------------------------------------------------`;
    logger.http(logMessage);

    res.on('finish', () => {
        const responseTime = Date.now() - start;  // Calculate response time

        logger.http(`
        [INFO] ${new Date().toISOString()} - Response sent:
        Status: ${res.statusCode}
        Response Time: ${responseTime}ms
------------------------------------------------------------------------------------------
        Response Headers  : {
            Content-Type: ${res.getHeader('Content-Type') || 'Not Provided'},
            Authorization: ${res.getHeader('Authorization') || 'Not Provided'}
        }
        ${responseBody ? `
        Response Body     :${JSON.stringify(responseBody, null, 2)
                .replace(/^\{/, '  {')  // Add 2 spaces before the opening brace
                .replace(/\}$/, '        }')  // Add 8 spaces before the closing brace
                .replace(/^(?=\s*".*":)/gm, '        ')}` : ''}
------------------------------------------------------------------------------------------`);
    });

    next(); // Pass control to the next middleware
};

export default requestLogger;