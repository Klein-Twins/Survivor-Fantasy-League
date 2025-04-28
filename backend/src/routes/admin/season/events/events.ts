import express from 'express';
import survivorEliminationController from '../../../../controllersBackup/events/survivorEliminationController';

const router = express.Router();

router.post(
  '/:episodeId/elimination',
  survivorEliminationController.processSurvivorElimination
);

export default router;
