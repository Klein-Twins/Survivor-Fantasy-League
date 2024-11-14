import express from 'express';
import survivorController from '../../controllers/survivor/survivorController.ts';

const router = express.Router();

router.get('/getSurvivorsWithDetailsBySeason', survivorController.getSurvivorWithDetailsForSeason);

export default router;