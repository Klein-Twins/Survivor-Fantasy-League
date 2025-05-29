import { Request } from 'express';
import logger from '../../config/logger';

export function logApiRequestOnReceival(apiOpName: string, req: Request) {
  logger.apiOp(`API Operation Request Received: ${apiOpName}`);
  if (req.params && Object.keys(req.params).length > 0) {
    logger.apiOp(`Request path params: ${JSON.stringify(req.params)}`);
  } else {
    logger.apiOp(`Request path params: No path params`);
  }
  if (req.body && Object.keys(req.body).length > 0) {
    logger.apiOp(`Request body: ${JSON.stringify(req.body)}`);
  } else {
    logger.apiOp(`Request body: No body`);
  }
  if (req.query && Object.keys(req.query).length > 0) {
    logger.apiOp(`Request query: ${JSON.stringify(req.query)}`);
  } else {
    logger.apiOp(`Request query: No query`);
  }
  //   if (req.headers ) {
  //     logger.apiOp(`Request headers: ${JSON.stringify(req.headers)}`);
  //   }
  //   if (req.cookies) {
  //     logger.apiOp(`Request cookies: ${JSON.stringify(req.cookies)}`);
  //   }
}
