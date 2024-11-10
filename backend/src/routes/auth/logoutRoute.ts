import express from 'express';
import authController from '../../controllers/auth/authController.ts';
import tokenMiddleware from '../../middleware/tokenMiddleware.ts';

const router = express.Router();

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: 
 *       - Authentication
 *     description: Logs out the user by invalidating the JWT token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out user
 *       403:
 *         description: Forbidden, invalid or missing token
 *       500:
 *         description: Unexpected error
 */
router.post('/logout', tokenMiddleware.authenticateToken, authController.logout);

export default router;