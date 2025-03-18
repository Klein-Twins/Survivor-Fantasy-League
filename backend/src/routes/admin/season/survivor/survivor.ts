import express from 'express';
import survivorController from '../../../../controllers/season/survivorController';

const router = express.Router();

router.post('/', survivorController.createSurvivor);

export default router;
