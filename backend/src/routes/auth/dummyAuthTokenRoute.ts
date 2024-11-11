import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
const router = express.Router();
/**
 * @swagger
 * /api/auth/dummyAuthRoute:
 *   post:
 *     summary: Runs the authenticate middleware for testing purposes
 *     operationId: dummyAuthenticateUser
 *     tags: 
 *       - Authentication
 *     description: Logs out the user by invalidating the JWT token.
 *     parameters:
 *       - in: cookie
 *         name: accessToken
 *         required: false
 *         schema:
 *           type: string
 *         description: Access token for authorization stored in a session cookie
 *       - in: cookie
 *         name: refreshToken
 *         required: false
 *         schema:
 *           type: string
 *         description: Refresh token for authorization stored in a session cookie
 *     responses:
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/dummyAuthRoute', tokenMiddleware.authenticateToken);

export default router;