import { RootState } from '../index';

export const authSelectorState = (state: RootState) => state.auth;
export const notificationSelectorState = (state: RootState) => state.notifications;
