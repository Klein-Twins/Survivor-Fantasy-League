import { NextFunction, Request, Response } from 'express';
import logger from '../../config/logger';
import { BAD_REQUEST_ERROR, NOT_FOUND_ERROR } from '../../constants/auth/responseErrorConstants';
import { NotificationAttributes, NotificationType } from '../../models/Notification';
import notificationResponseBuilder from '../../servicesAndHelpers/notification/notificationResponseBuilder';
import notificationService from '../../servicesAndHelpers/notification/notificationService';
import { GetNotificationsForProfileResponse } from '../../types/notification/notificationDto';
import errorFactory from '../../utils/errors/errorFactory';
import { NotificationContext } from '../../servicesAndHelpers/notification/notificationBuilder';

const notificationController = {
    getNotificationsForProfile: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { profileId } = req.params;
            if (!profileId) {
                throw errorFactory(BAD_REQUEST_ERROR);
            }
            const notifications: NotificationAttributes[] = await notificationService.getNotificationsForProfile(profileId);
            const responseBody: GetNotificationsForProfileResponse = notificationResponseBuilder.buildGetNotificationsForProfileResponse(notifications);

            res.status(200).json(responseBody)
        } catch (error) {
            logger.debug("Caught error in notificationController.markNotificationAsRead()")
            next(error) 
        }
    },
    markNotifcationAsRead: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { notificationId } = req.params;
            if (!notificationId) {
                throw errorFactory(BAD_REQUEST_ERROR);
            }
            const doesNotificationExist: boolean = await notificationService.doesNotificationExist(notificationId!)
            if (!doesNotificationExist) {
                throw errorFactory(NOT_FOUND_ERROR);
            }
            notificationService.markNotificationAsRead(notificationId);
            res.status(204);
        } catch (error) {
            logger.debug("Caught error in notificationController.markNotificationAsRead()")
            next(error)
        }
    },
    testNotification: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let context: NotificationContext = { 
                profileId: '48175a74-822b-4172-8665-355952d3bdc4', 
                inviterName: 'Patrick', 
                leagueName: 'Corner By The Bookshelf', 
                inviteId: '3c72ca39-47e1-43d3-b420-a8fafb93212e', 
                leagueId: '3c72ca39-47e1-43d3-b420-a8fafb93212e'
            }
            await notificationService.createNotification(NotificationType.LEAGUE_INVITE, context)    
            res.status(200).json("OK")
        } catch (err) {
            console.log(err)
        }
    }
};

export default notificationController;