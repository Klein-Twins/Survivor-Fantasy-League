import express from 'express';
import survivorController from '../../controllers/survivor/survivorController.ts';

const router = express.Router();

router.get('/', survivorController.getSurvivors);

export default router;