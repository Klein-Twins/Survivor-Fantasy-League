import express from 'express';

import loginRoute from './loginRoute';
import signupRoute from './signupRoute';
import logoutRoute from './logoutRoute';
import dummyAuthTokenRoute from './dummyAuthTokenRoute';
import authController from '../../controllers/auth/authController';
import tokenMiddleware from '../../middleware/tokenMiddleware';

const router = express.Router();

router.use('/', [loginRoute, signupRoute, logoutRoute, dummyAuthTokenRoute ])

//router.post('/refreshToken', authController.refreshTokens);



export default router;