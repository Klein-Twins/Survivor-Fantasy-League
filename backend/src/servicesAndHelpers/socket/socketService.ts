import { io, userSockets } from '../../../app';
import logger from '../../config/logger';
import { NotificationAttributes } from '../../models/account/Notification';

const socketService = {
  notifyUser(profileId: string, notification: NotificationAttributes): void {
    const socketId: string | undefined = userSockets.get(profileId);
    if (socketId) {
      io.to(socketId).emit('notification', notification);
    } else {
      logger.debug(`User ${profileId} was not notified because they are not connected to socket`);
    }
  },
};

export default socketService;
