import express from 'express';

import tribeRoutes from './tribe/tribe';
import survivorRoutes from './survivor/survivor';
import seasonController from '../../../controllers/season/seasonController';
import eventRoutes from './events/events';

const router = express.Router();

router.use('/tribe', tribeRoutes);
router.use('/survivor', survivorRoutes);
router.post('/', seasonController.createSeason);

router.use('/events', eventRoutes);

export default router;
