import express from 'express';
import tribeController from '../../../../controllers/season/tribeController';

const router = express.Router();

router.post('/', tribeController.createTribe);

export default router;
