import express from 'express';

const router = express.Router();

import authRoutes from './auth/authRoutes'
import survivorRoute from './survivors/survivorRoutes';
import leagueRoutes from './leagues/leagueRoutes'

router.use('/auth', authRoutes);
router.use('/league', leagueRoutes);
router.use('/survivor', survivorRoute);

export default router;