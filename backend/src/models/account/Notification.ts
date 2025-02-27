import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ProfileAttributes } from './Profile';

export enum NotificationType {
  LEAGUE_INVITE = 'LEAGUE_INVITE',
  GENERAL = 'GENERAL', // Example of an additional notification type
}

export interface NotificationData {
  leagueId?: string;
  inviteId?: string;
  surveyId?: string;
  score?: number;
  leagueName?: string;
  surveyTitle?: string;
  [key: string]: any;
}

export interface NotificationAttributes {
  notificationId: UUID;
  profileId: ProfileAttributes['profileId'];
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  data?: NotificationData;
}

const NotificationModel = (sequelize: Sequelize) => {
  class Notification extends Model<NotificationAttributes> implements NotificationAttributes {
    public notificationId!: NotificationAttributes['notificationId'];
    public profileId!: NotificationAttributes['profileId'];
    public type!: NotificationAttributes['type'];
    public title!: NotificationAttributes['title'];
    public message!: NotificationAttributes['message'];
    public read!: NotificationAttributes['read'];
    public timestamp!: NotificationAttributes['timestamp'];
    public data?: NotificationAttributes['data'];

    static associate(models: any) {
      this.belongsTo(models.Profile, {
        foreignKey: 'profileId',
        targetKey: 'profileId',
        as: 'profile',
      });
    }
  }

  Notification.init(
    {
      notificationId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'NOTIFICATION_ID',
      },
      profileId: {
        type: DataTypes.UUID,
        allowNull: false, // Typically, notifications should have a user (profile) associated
        field: 'PROFILE_ID',
      },
      type: {
        type: DataTypes.ENUM(...Object.values(NotificationType)),
        allowNull: false, // Enforce that the type must be one of the NotificationType enum values
        field: 'NOTIFICATION_TYPE',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false, // Enforce that each notification has a title
        field: 'TITLE',
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'MESSAGE',
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'READ',
      },
      timestamp: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'TIMESTAMP',
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'DATA',
      },
    },
    {
      sequelize,
      tableName: 'NTF_NOTIFICATION',
      timestamps: true,
      createdAt: 'CREATED_AT',
      updatedAt: 'UPDATED_AT',
    }
  );

  return Notification;
};

export default NotificationModel;
