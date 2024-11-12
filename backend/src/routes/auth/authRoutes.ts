import express from 'express';

import loginRoute from './loginRoute';
import signupRoute from './signupRoute';
import logoutRoute from './logoutRoute';
import dummyAuthTokenRoute from './dummyAuthTokenRoute';
import refreshTokenRoute from './refreshTokenRoute';
import refreshExpiresInRoute from './refreshExpiresInRoute'
import checkAuthRoute from './checkAuthRoute';

const router = express.Router();

router.use('/', [loginRoute, signupRoute, logoutRoute, dummyAuthTokenRoute, refreshTokenRoute, refreshExpiresInRoute, checkAuthRoute ])

export default router;