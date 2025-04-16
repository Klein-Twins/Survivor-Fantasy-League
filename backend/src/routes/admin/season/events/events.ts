import express from 'express';
import survivorEliminationController from '../../../../controllers/events/survivorEliminationController';

const router = express.Router();

router.post(
  '/:episodeId/elimination',
  survivorEliminationController.processSurvivorElimination
);

export default router;
