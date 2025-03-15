import express from 'express';
import authController from '../../controllers/auth/authController';
import tokenMiddleware from '../../middleware/tokenMiddleware';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post(
  '/extend-session',
  tokenMiddleware.authenticateToken,
  authController.extendSession
);
router.get('/check-auth', authController.checkAuth);

export default router;
