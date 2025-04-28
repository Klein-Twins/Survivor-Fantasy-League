import express from 'express';

const router = express.Router();

import authRoutes from './auth/auth';
// import seasonRoutes from './season/season';
// import leagueRoutes from './league/league';
// import imageRoutes from './image/image';
// import adminRoutes from './admin/admin';

router.use('/auth', authRoutes);
// router.use('/season', seasonRoutes);
// router.use('/league', leagueRoutes);
// router.use('/image', imageRoutes);
// router.use('/admin', adminRoutes);

export default router;
