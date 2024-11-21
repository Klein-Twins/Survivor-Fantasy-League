import { NotificationAttributes, NotificationType, OptNotificationAttributes } from "../../models/Notification";

export interface NotificationContext {
    profileId: string;
    inviterName?: string;
    leagueName?: string;
    inviteId?: string;
    leagueId?: string;
    surveyId?: string;
}

const buildLeagueInviteNotification = (context: NotificationContext): OptNotificationAttributes => {
    const { profileId, inviterName, leagueName, inviteId, leagueId } = context;

    return {
        profileId,
        type: NotificationType.LEAGUE_INVITE,
        title: `You have been invited to join the league: ${leagueName}`,
        message: `${inviterName} has invited you to join the league. Do you accept?`,
        read: false,
        timestamp: new Date().toString(),
        data: {
            inviteId,
            leagueId
        }
    };
};


const buildGeneralNotification = (context: NotificationContext): OptNotificationAttributes => {
    const { profileId } = context;
    return {
        profileId,
        type: NotificationType.GENERAL,
        title: "You have a new notification",
        message: "You have received a notification",
        read: false,
        timestamp: new Date().toString(),
        data: {}
    };
};

const buildNotification = (notifType: NotificationType, context: NotificationContext): OptNotificationAttributes => {
    let notification: OptNotificationAttributes;

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
    buildLeagueInviteNotification
};
