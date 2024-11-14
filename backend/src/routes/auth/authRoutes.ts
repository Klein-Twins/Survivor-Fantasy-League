import express from 'express';
import authController from '../../controllers/auth/authController';
import tokenController from '../../controllers/auth/tokenController';
import accountController from '../../controllers/auth/accountController';

const router = express.Router();

router.post('/login', authController.login, tokenController.generateTokensAfterSignupOrLogin);
router.post('/signup', accountController.createAccount, tokenController.generateTokensAfterSignupOrLogin);
router.post('/logout', authController.logout);
router.post('/extend-session', tokenController.extendSessionByRefreshingAccessAndRefreshTokens);
router.get('/refresh-token-expires-in', tokenController.getRefreshTokenExpiresIn);
router.get('/check-auth', tokenController.checkIsAuthenticated);

export default router;