import {  configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import authReducer from './reducers/AuthReducer';
import notificationReducer from './reducers/NotificationReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer
})

const store = configureStore({
  reducer: rootReducer
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;