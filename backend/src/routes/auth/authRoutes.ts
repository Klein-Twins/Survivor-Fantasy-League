import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
import authController from '../../controllers/auth/authController';

const router = express.Router();

//router.post('/login', authController.login, tokenController.createSession);
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
