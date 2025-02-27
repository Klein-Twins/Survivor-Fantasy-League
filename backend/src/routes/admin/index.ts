import express from 'express';

const router = express.Router();

import seasonRoutes from './seasonRoutes';

router.use('/season', seasonRoutes);

export default router;
