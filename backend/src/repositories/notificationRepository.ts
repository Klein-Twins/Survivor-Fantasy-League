import { CreateOptions } from 'sequelize';
import { models } from '../config/db';
import { NotificationAttributes } from '../models/account/Notification';

const notificationRepository = {
  createNotification: async (
    notification: NotificationAttributes,
    options?: CreateOptions // `options` is optional
  ): Promise<NotificationAttributes> => {
    // Your logic to create the notification
    return await models.Notification.create(notification, options || {});
  },
  findNotificationById: async (notificationId: string): Promise<NotificationAttributes | null> => {
    return await models.Notification.findOne({
      where: {
        notificationId: notificationId,
      },
    });
  },
  updateNotification: async (notification: NotificationAttributes): Promise<[affectedCount: number]> => {
    return await models.Notification.update(notification, {
      where: { notificationId: notification.notificationId },
    });
  },
  findNotificationsByProfileId: async (profileId: string): Promise<NotificationAttributes[]> => {
    return await models.Notification.findAll({
      where: {
        profileId: profileId,
      },
    });
  },
};

export default notificationRepository;
