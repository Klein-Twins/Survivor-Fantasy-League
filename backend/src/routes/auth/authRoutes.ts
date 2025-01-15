import express from 'express';
import authController from '../../controllers/auth/authController';
import tokenController from '../../controllers/auth/tokenController';
import accountController from '../../controllers/auth/accountController';
import tokenMiddleware from '../../middleware/tokenMiddleware';

const router = express.Router();

router.post('/login', authController.login, tokenController.createSession);
router.post('/signup', accountController.createAccount, tokenController.createSession);
router.post('/logout', tokenMiddleware.authenticateToken, authController.unauthenticatedlogout, authController.authenticatedLogout);

router.post('/extend-session', tokenMiddleware.authenticateToken, tokenController.extendSessionByRefreshingTokens);
router.get('/check-auth', tokenController.checkIsAuthenticated);

export default router;