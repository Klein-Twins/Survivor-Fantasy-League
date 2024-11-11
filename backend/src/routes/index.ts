import express from 'express';

const router = express.Router();

import authRoutes from './auth/authRoutes'
import survivorRoute from './survivors/getSurvivors.ts';
import leagueRoutes from './leagues/leagueRoutes'

router.use('/auth', authRoutes);
router.use('/', leagueRoutes);
router.use('/survivor', survivorRoute);

export default router;