import express from 'express';

const router = express.Router();

// Import the route modules
import loginRoute from './auth/login.ts';
import signupRoute from './auth/signup.ts';
import changePasswordRoute from './auth/changePassword.ts';
import logoutRoute from './auth/logout.ts';
import survivorRoute from './survivors/getSurvivors.ts';
import postLeagueRoute from './leagues/postLeague.ts'

// Use the routes with the appropriate base paths
router.use('/auth', [loginRoute, signupRoute, changePasswordRoute, logoutRoute]);
router.use('/', [survivorRoute, postLeagueRoute]);

export default router;