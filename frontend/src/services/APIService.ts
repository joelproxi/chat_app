import { ILogin, IRegister, IUserModel } from "../models/UserModel";
import api, { axiosInstance } from "./Api";
import AuthHeaders from "./AuthHeader";

class ApiService {
  setUserToLocalStorage = (data: IUserModel) => {
    localStorage.setItem("user", JSON.stringify(data));
  };

  getUserFromLocalStorage = () => {
    const user = localStorage.getItem("user")!;
    return JSON.parse(user);
  };

  login = async (data: ILogin) => {
    const resp = await axiosInstance.post("/accounts/login/", data);
    return resp;
  };

  register = async (data: IRegister) => {
    const resp = await axiosInstance.post("/accounts/register/", data);
    return resp;
  };

  logout = async () => {
    const resp = await api.post(
      "/accounts/logout/",
      {},
      {
        headers: { ...AuthHeaders() },
      }
    );
    return resp;
  };

  getConversations = async () => {
    const resp = await api.get("/chats/conversations/", {
      headers: { ...AuthHeaders() },
    });
    return resp;
  };

  getUsers = async () => {
    const resp = await api.get("/accounts/users/", {
      headers: { ...AuthHeaders() },
    });
    return resp;
  };

  getMessages = async (conversationName: string, page: string | number) => {
    // const resp = await api.get(`/chats/messages/?conversation_name=${conversationName}&page=${page}`,
    const resp = await api.get(
      `/chats/messages/?conversation_name=${conversationName}`,
      {
        headers: { ...AuthHeaders() },
      }
    );
    return resp;
  };

  uplaodFile = async (formData: FormData) => {
    const resp = await api.post("/chats/file/upload/", formData, {
      headers: { ...AuthHeaders(), "Content-Type": "multipart/form-data" },
    });
    return resp;
  };

  downlaodFile = async (uploadId: string) => {
    const resp = await api.get("/chats/file/download/", {
      headers: { ...AuthHeaders() },
      params: { upload_id: uploadId },
      responseType: "blob",
    });
    return resp;
  };
}

export default new ApiService();
