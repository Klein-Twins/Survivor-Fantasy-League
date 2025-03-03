import express from 'express';
import seasonController from '../../controllers/season/seasonController';
import survivorController from '../../controllers/survivor/survivorController';
import tribeController from '../../controllers/season/tribeController';

const router = express.Router();

router.get('/:seasonId', seasonController.getSeasons);
router.post('/', seasonController.createSeason);
router.get('/', seasonController.getSeasons);

router.post('/survivor', survivorController.createSurvivor);

router.post('/tribe', tribeController.createTribe);

export default router;
