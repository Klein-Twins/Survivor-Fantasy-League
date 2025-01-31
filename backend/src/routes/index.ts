import express from 'express';

const router = express.Router();

import authRoutes from './auth/authRoutes';
import survivorRoute from './survivors/survivorRoutes';
import leagueProfileRoutes from './leagues/leagueProfileRoutes';
import profileLeagueRoutes from './profile/profileLeagueRoutes';
import notificationRoutes from './notification/notificationRoutes';
import leagueInviteRoutes from './leagues/leagueInviteRoutes';
import imageRoutes from './image/imageRoutes';
import leagueSurveyRoutes from './leagues/surveyRoutes';

router.use('/auth', authRoutes);
router.use('/league/profile', leagueProfileRoutes);
router.use('/season/survivors', survivorRoute);
router.use('/profile', profileLeagueRoutes);
router.use('/league/invite', leagueInviteRoutes);
router.use('/league/:leagueId/survey', leagueSurveyRoutes);
router.use('/image', imageRoutes);
router.use('/notification', notificationRoutes);

export default router;
