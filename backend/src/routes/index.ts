import express from 'express';

const router = express.Router();

import authRoutes from './auth/authRoutes'
import survivorRoute from './survivors/getSurvivors.ts';

router.use('/auth', authRoutes);
router.use('/survivor', survivorRoute);

export default router;