import express from 'express';
import seasonController from '../../controllersBackup/season/seasonController';

const router = express.Router();

router.get('/', seasonController.getSeasons);

export default router;
