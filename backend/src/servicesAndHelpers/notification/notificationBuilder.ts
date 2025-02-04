import { UUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { NotificationAttributes, NotificationType } from '../../models/account/Notification';

export interface NotificationContext {
  profileId: string;
  inviterName?: string;
  leagueName?: string;
  inviteId?: string;
  leagueId?: string;
  surveyId?: string;
}

const buildLeagueInviteNotification = (context: NotificationContext): NotificationAttributes => {
  const { profileId, inviterName, leagueName, inviteId, leagueId } = context;

  return {
    notificationId: uuidv4() as UUID,
    profileId,
    type: NotificationType.LEAGUE_INVITE,
    title: `You have been invited to join the league: ${leagueName}`,
    message: `${inviterName} has invited you to join the league. Do you accept?`,
    read: false,
    timestamp: new Date().toString(),
    data: {
      inviteId,
      leagueId,
    },
  };
};

const buildGeneralNotification = (context: NotificationContext): NotificationAttributes => {
  const { profileId } = context;
  return {
    notificationId: uuidv4() as UUID,
    profileId,
    type: NotificationType.GENERAL,
    title: 'You have a new notification',
    message: 'You have received a notification',
    read: false,
    timestamp: new Date().toString(),
    data: {},
  };
};

const buildNotification = (notifType: NotificationType, context: NotificationContext): NotificationAttributes => {
  let notification: NotificationAttributes;

  switch (notifType) {
    case NotificationType.LEAGUE_INVITE:
      notification = buildLeagueInviteNotification(context);
      break;
    default:
      notification = buildGeneralNotification(context);
      break;
  }

  return notification;
};

export default {
  buildNotification,
  buildLeagueInviteNotification,
};
