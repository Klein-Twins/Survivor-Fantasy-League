import express from 'express';
import authController from '../../controllers/auth/authController';
const router = express.Router();
/**
 * @swagger
 * /api/auth/extendSession:
 *   post:
 *     summary: Creates a new refresh token to extend the session
 *     operationId: dummyAuthenticateUser
 *     tags: 
 *       - Authentication
 *     description: Logs out the user by invalidating the JWT token.
 *     parameters:
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
 *       200:
 *         description: Session Extended
 */
router.post('/extendSession', authController.refreshTokens);

export default router;