import express from 'express';

import notificationController from '../../controllers/notification/notificationController';
import tokenMiddleware from '../../middleware/tokenMiddleware';

const router = express.Router();

router.put('/:notificationId', tokenMiddleware.authenticateToken, notificationController.markNotifcationAsRead);
router.post('/test', notificationController.testNotification)

export default router;