import express from 'express';
import seasonController from '../../controllers/season/seasonController';

const router = express.Router();

router.get('/:seasonId', seasonController.getSeasons);
router.post('/', seasonController.createSeason);
router.get('/', seasonController.getSeasons);

export default router;
