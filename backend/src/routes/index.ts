import express from 'express';

const router = express.Router();

import authRoutes from './auth/authRoutes'
import survivorRoute from './survivors/survivorRoutes';
import leagueProfileRoutes from './leagues/leagueProfileRoutes'
import profileLeagueRoutes from './profile/profileLeagueRoutes';
import notificationRoutes from './notification/notificationRoutes';

router.use('/auth', authRoutes);
router.use('/league/profile', leagueProfileRoutes);
router.use('/survivor', survivorRoute);
router.use('/profile/leagues', profileLeagueRoutes);
router.use('/notification', notificationRoutes)

export default router;