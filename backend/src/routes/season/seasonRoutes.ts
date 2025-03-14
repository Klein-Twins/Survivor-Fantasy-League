import express from 'express';
import seasonController from '../../controllers/season/seasonController';

const router = express.Router();

router.get('/', seasonController.getSeasons);

export default router;
