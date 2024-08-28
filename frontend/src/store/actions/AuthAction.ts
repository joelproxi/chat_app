import { Dispatch } from 'redux';
import { LOGIN_FAILURE,
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGOUT, 
    LOGOUT_FAILURE, 
    LOGOUT_REQUEST, 
    LOGOUT_SUCCESS, 
    REGISTER_FAILURE, 
    REGISTER_REQUEST, 
    REGISTER_SUCCESS } from '../constants/AuthConstant';
import { ILogin, IRegister } from '../../models/UserModel';
import AuthService from '../../services/APIService';




export const loginAction = (data: ILogin) => {
  return async (dispatch: Dispatch) => {
      dispatch({ type: LOGIN_REQUEST });
      try {
          const response = await AuthService.login(data);
        if (response.data?.token) {
            setItemToLocalStorage("user", response.data);
          console.log(response.data);
        dispatch({ type: LOGIN_SUCCESS, payload: response.data });
      } else {
        dispatch({ type: LOGIN_FAILURE, error: 'Login failed' });
      }
    } catch (error ) {
      dispatch({ type: LOGIN_FAILURE, error: error.message });
    }
  };
};

export const registerAction = (data: IRegister) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: REGISTER_REQUEST });

    try {
        console.log(data);
      const response = await AuthService.register(data);
      if (response.status === 200) {
        console.log(response.data);
        dispatch({ type: REGISTER_SUCCESS, payload: response.data });
        setItemToLocalStorage("user", response.data);
      } else {
        dispatch({ type: REGISTER_FAILURE, error: 'Registration failed' });
      }
    } catch (error) {
      dispatch({ type: REGISTER_FAILURE, error: error.message });
    }
  };
};

export const logoutAction = () => {
  return async (dispatch: Dispatch) => {
    dispatch({type: LOGOUT_REQUEST});
    try {
      const response = await AuthService.logout();
      if(response.status === 200){
        console.log(response.data);
        dispatch({type: LOGOUT_SUCCESS, payload: response.data});
        removeItemFromLocalstorage('user');
      }
    } catch (error) {
      dispatch({type: LOGOUT_FAILURE, payload: error.message})
    }
  }
};



function setItemToLocalStorage(key: string, value: any){
    localStorage.setItem(key, JSON.stringify(value));
}

function getItemFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key)!);
}

function removeItemFromLocalstorage(key: string) {
    localStorage.removeItem(key);
}