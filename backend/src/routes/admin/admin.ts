import express from 'express';

import seasonRoutes from './season/season';

const router = express.Router();

router.use('/season', seasonRoutes);

export default router;
