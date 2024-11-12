import express from 'express';
import authController from '../../controllers/auth/authController';
import tokenController from '../../controllers/auth/tokenController';
const router = express.Router();
/**
 * @swagger
 * /api/auth/refresh-token-expires-in:
 *   get:
 *     summary: Checks the expiration time of the refresh token
 *     operationId: checkRefreshTokenExpiry
 *     tags: 
 *       - Authentication
 *     description: Returns the remaining time (in seconds) until the refresh token expires.
 *     responses:
 *       400:
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Invalid refresh token
 *       401:
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Refresh token not found
 *       200:
 *         description: Responses with the number of seconds remaining until refresh token expires
 *         content:
 *              application/json:
 *                 schema:
 *                      type: object
 *                      properties:
 *                          remainingTime:
 *                              type: integer
 *                              example: 500
 *       500:
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Failed to decode refresh token
 */
router.get('/refresh-token-expires-in', tokenController.getRefreshTokenExpiresIn);

export default router;