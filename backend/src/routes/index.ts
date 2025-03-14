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
import adminRoutes from './admin/index.ts';
import leagueRoutes from './leagues/leagueRoutes.ts';
import surveyController from '../controllers/league/survey/surveyController.ts';
import seasonRoutes from './season/seasonRoutes';

router.use('/auth', authRoutes);
router.use('/league/profile', leagueProfileRoutes);
router.use('/season', seasonRoutes);
router.use('/season/survivors', survivorRoute);
router.use('/profile', profileLeagueRoutes);
router.use('/league/invite', leagueInviteRoutes);
router.use('/league', leagueRoutes);
router.use('/league/survey', leagueSurveyRoutes);
router.use('/image', imageRoutes);
router.use('/notification', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;
