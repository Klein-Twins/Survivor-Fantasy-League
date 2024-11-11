import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
const router = express.Router();
/**
 * @swagger
 * /api/auth/dummyAuthRoute:
 *   post:
 *     summary: Runs the authenticate middleware for some testing
 *     operationId: dummyAuthenticateUser
 *     tags: 
 *       - Authentication
 *     description: Logs out the user by invalidating the JWT token.
 *     parameters:
 *       - in: header
 *         name: X-Access-Token
 *         required: false
 *         schema:
 *           type: string
 *         description: Bearer access token for authorization
 *       - in: header
 *         name: X-Refresh-Token
 *         required: false
 *         schema:
 *           type: string
 *         description: Bearer refresh token for authorization
 *     responses:
 *       200:
 *         description: Successfully logged out user
 *       403:
 *         description: Forbidden, invalid or missing token
 *       500:
 *         description: Unexpected error
 */
router.post('/dummyAuthRoute', tokenMiddleware.authenticateToken);

export default router;