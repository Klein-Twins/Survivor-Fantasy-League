import { NotificationAttributes, NotificationType } from '../../models/account/Notification';
import notificationRepository from '../../repositories/notificationRepository';
import { NotFoundError } from '../../utils/errors/errors';
import socketService from '../socket/socketService';
import notificationBuilder, { NotificationContext } from './notificationBuilder';

const notificationService = {
  doesNotificationExist: async (notificationId: string): Promise<boolean> => {
    const notification: NotificationAttributes | null = await notificationRepository.findNotificationById(
      notificationId
    );
    return notification ? true : false;
  },
  createNotification: async (
    notificationType: NotificationType,
    context: NotificationContext
  ): Promise<NotificationAttributes> => {
    const notification: NotificationAttributes = await notificationRepository.createNotification(
      notificationBuilder.buildNotification(notificationType, context),
      {}
    );
    socketService.notifyUser(context.profileId, notification);
    return notification;
  },
  markNotificationAsRead: async (notificationId: string) => {
    const notification = await notificationRepository.findNotificationById(notificationId);
    if (!notification) {
      throw new NotFoundError(`Notification with id ${notificationId} not found`);
    }
    notification.read = true;
    notificationRepository.updateNotification(notification);
  },

  getNotificationsForProfile: async (profileId: string): Promise<NotificationAttributes[]> => {
    try {
      return await notificationRepository.findNotificationsByProfileId(profileId);
    } catch (error) {
      console.error('Error fetching notifications for profile:', error);
      throw new Error('Could not fetch notifications for profile');
    }
  },
};

export default notificationService;
