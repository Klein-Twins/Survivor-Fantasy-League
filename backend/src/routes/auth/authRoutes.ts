import express from 'express';

import loginRoute from './loginRoute';
import signupRoute from './signupRoute';
import logoutRoute from './logoutRoute';
import refreshTokenRoute from './extendSessionRoute';
import refreshExpiresInRoute from './refreshExpiresInRoute'
import checkAuthRoute from './checkAuthRoute';

const router = express.Router();

router.use('/', [loginRoute, signupRoute, logoutRoute, refreshTokenRoute, refreshExpiresInRoute, checkAuthRoute ])

export default router;