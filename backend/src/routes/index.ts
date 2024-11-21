import express from 'express';

const router = express.Router();

import authRoutes from './auth/authRoutes'
import survivorRoute from './survivors/survivorRoutes';
import leagueRoutes from './leagues/leagueRoutes'
import profileRoutes from './profile/profileRoutes';
import notificationRoutes from './notification/notificationRoutes';

router.use('/auth', authRoutes);
router.use('/league', leagueRoutes);
router.use('/survivor', survivorRoute);
router.use('/profile', profileRoutes);
router.use('/notification', notificationRoutes)

export default router;