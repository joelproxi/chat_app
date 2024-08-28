import { INotification } from "../../models/NotificationModel";
import { RECEIVE_NOTIFICATION } from "../constants/NotificationConstant";


interface ReceiveNotificationAction {
    type: typeof RECEIVE_NOTIFICATION;
    payload: INotification;
}

export const receiveNotification = (notification: INotification): ReceiveNotificationAction => (
    {
        type: RECEIVE_NOTIFICATION,
        payload: notification,
    }
)

export type NotificationActionType = ReceiveNotificationAction;
