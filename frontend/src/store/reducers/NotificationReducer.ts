// src/redux/reducers.ts
import { INotification } from '../../models/NotificationModel';
import { NotificationActionType } from '../actions/NotificationAction';
import { RECEIVE_NOTIFICATION } from '../constants/NotificationConstant';



export interface NotificationState {
    notifications: INotification[];
}

const initialState: NotificationState = {
    notifications: [],
};

const notificationReducer = (state = initialState, action: NotificationActionType): NotificationState => {
    switch (action.type) {
        case RECEIVE_NOTIFICATION:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
            };
        default:
            return state;
    }
};

export default notificationReducer;