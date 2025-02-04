import { NotificationAttributes } from '../../models/account/Notification';
import { GetNotificationsForProfileResponse } from '../../types/notification/notificationDto';

const notificationResponseBuilder = {
  buildGetNotificationsForProfileResponse: (
    notifications: NotificationAttributes[]
  ): GetNotificationsForProfileResponse => {
    const response: GetNotificationsForProfileResponse = {
      notifications: notifications,
    };
    return response;
  },
};

export default notificationResponseBuilder;
