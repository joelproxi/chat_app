import axios from "axios";
import { redirect } from "react-router-dom";
import { IUserModel } from "../models/UserModel";

// export const BASE_URL = "http://192.168.1.158:8000";
// export const BASE_URL_WS = "ws://192.168.1.158:8000";
export const BASE_URL = "http://0.0.0.0:8000/api/v1";
export const BASE_URL_WS = "ws://127.0.0.1:8000";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const user: IUserModel | null = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null; // Get token from local storage
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx causes this function to trigger
    // Do something with response error
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      // Example:
      localStorage.removeItem("user");
      return redirect("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
