import { ChangeEvent, useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHotkeys } from "react-hotkeys-hook";
import {
  decryptTextMessage,
  encryptTextMessage,
  parseJwt,
} from "../utils/utils";
import CryptoJS from "crypto-js";
import { saveAs } from "file-saver";
import { v4 as uuid4 } from "uuid";

import NavBar from "../components/NavBar";
import { authSelectorState } from "../store/selectors/AuthSelector";
import { BASE_URL_WS } from "../services/Api";
import Conversation from "../components/Conversation";
import AuthService from "../services/APIService";
import { IConversation } from "../models/ConversationModel";
import Message from "../components/Message";
import ChatLoader from "../components/ChatLoader";
import { IMessage } from "../models/MessageModel";
import { Navigate } from "react-router-dom";
import APIService from "../services/APIService";
import { IUserModel } from "../models/UserModel";

const CHUNK_SIZE = 1024 * 1024; //1MB

function ChatPage() {
  const initialState = { message: "" };
  const { user } = useSelector(authSelectorState);
  const [state, setState] = useState(initialState);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  const [conversationName, setConversationName] = useState<string>("home");
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [users, setUsers] = useState<IUserModel[]>([]);
  const [privateKey, setPrivateKey] = useState<string>("");
  const [page, setPage] = useState<number>(2);
  const [hasMoreMessage, setHasMoreMessage] = useState<boolean>(false);
  const [meTyping, setMeTyping] = useState(false);
  const timeout = useRef<any>();
  const [otherTyping, setOtherTyping] = useState(false);
  const [ohterUser, setohterUser] = useState<IUserModel | null>(null);
  const [onlines, setOnlines] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [sharedKey, setSharedKey] = useState<string>("");

  const { sendJsonMessage } = useWebSocket(
    user ? `${BASE_URL_WS}/${conversationName}/` : null,
    {
      // const { sendJsonMessage } = useWebSocket("ws://localhost:8000", {
      queryParams: { token: user ? user.token : "" },
      onOpen: () => {
        console.log("Opened");
      },

      onMessage: (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        switch (data.type) {
          case "last_50_messages_from_server":
            console.log(data.message);
            setMessageHistory(data?.messages);
            setHasMoreMessage(data?.has_more);
            break;

          case "send_message_to_user":
            setMessageHistory((prev: any) => prev.concat(data.message));
            break;

          case "user_join":
            console.log(onlines);

            // if(participients.includes(data.user)){
            //   setParticipients([...participients, data.user])
            // }else{
            //   setParticipients(participients);
            // }
            setOnlines((pts: string[]) => {
              if (!pts.includes(data.user)) {
                return [...pts, data.user];
              }
              return pts;
            });
            break;

          case "user_leave":
            setOnlines((ptcps: string[]) => {
              const newPtcps = ptcps.filter(
                (item: string) => item !== data.user
              );
              return newPtcps;
            });
            break;

          case "online_user_list":
            // setParticipients(data.user)
            break;

          case "typing":
            updateTyping(data);
            break;

          case "shared_key":
            console.log(decryptTextMessage(privateKey, data.key));
            setSharedKey(decryptTextMessage(privateKey!, data.key));
            break;

          default:
            console.error("error");
            break;
        }
      },

      onClose: (error) => {
        console.error(error);
      },
    }
  );

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
    onTyping();
    console.log({ [name]: value });
  };

  const handleOnSubmit = async (event: { preventDefault: () => void }) => {
    if (Message.length === 0) return;

    try {
      sendJsonMessage({
        type: "send_message_to_user",
        message: state.message,
        date: new Date(),
      });
      setState(initialState);
      clearTimeout(timeout.current);
      timeOut();
    } catch (error) {
      console.error("Error encrypting message:", error);
    }

    event.preventDefault();
  };

  const selectUser = (user: IUserModel) => {
    console.log(user);
    setConversationName(createConversationName(user.telephone));
    setohterUser(user);
  };

  const selectConversation = async (conversation: IConversation) => {
    setConversationName(
      createConversationName(conversation.other_user.telephone)
    );
    setohterUser(conversation.other_user);
    console.log(conversation.other_user);
    console.log(conversationName);
    await fetchMessages();
  };

  const handleDecryptTextMessage = (encryptedMessage: string) => {
    try {
      const decrypted = decryptTextMessage(privateKey!, encryptedMessage);
      return decrypted;
    } catch (error) {
      console.error("Decryption failed:", error);
    }
  };

  async function fetchMessages() {
    const resp = await AuthService.getMessages(conversationName, page);
    if (resp.status === 200) {
      const data: {
        count: number;
        next: string | null;
        previous: string | null;
        results: IMessage[];
      } = resp.data;
      setMessageHistory((prev: IMessage[]) => prev.concat(data.results));
      setPage(page + 1);
      setHasMoreMessage(data.next !== null);
      console.log(data.results);
    }
  }

  const inputReference: any = useHotkeys(
    "enter",
    () => {
      handleOnSubmit;
    },
    {
      enableOnFormTags: ["INPUT"],
    }
  );

  function timeOut() {
    setMeTyping(false);
    sendJsonMessage({
      type: "typing",
      typing: false,
    });
  }

  function onTyping() {
    if (meTyping === false) {
      setMeTyping(true);
      sendJsonMessage({
        type: "typing",
        typing: true,
      });
      timeout.current = setTimeout(timeOut, 5000);
    } else {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(timeOut, 5000);
    }
  }

  function updateTyping(event: { user: string; typing: boolean }) {
    console.log("&&&&&&&&&&&&&&&", event, "@@@@@", user);
    if (event.user !== user!.telephone) {
      setOtherTyping(event.typing);
    }
  }

  useEffect(() => {
    (inputReference.current as HTMLElement).focus();
  }, [inputReference]);

  useEffect(() => {
    const fetchUsersList = async () => {
      const resp = await APIService.getUsers();
      if (resp.status === 200) {
        setUsers(resp.data);
      }
    };
    fetchUsersList();

    const fetchConversations = async () => {
      const resp = await APIService.getConversations();
      if (resp.status === 200) {
        setConversations(resp.data);
        console.log(resp.data);
      }
    };
    fetchConversations();
    if (user?.token) {
      const decodeToken = parseJwt(user?.token);
      setPrivateKey(decodeToken.private_key);
    }
  }, [user, conversationName]);

  function createConversationName(telephone: string) {
    console.log(telephone);
    const namesAlph = [user?.telephone, telephone].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = uuid4();
    console.log(uploadId);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("file_name", file.name);
      formData.append("chunk_index", chunkIndex.toString());
      formData.append("total_chunks", totalChunks.toString());
      formData.append("conversation_name", conversationName);
      formData.append("sender_id", user?.telephone);
      formData.append("receiver_id", ohterUser?.telephone);
      formData.append("upload_id", uploadId);

      try {
        const resp = await APIService.uplaodFile(formData);
        if (resp.status === 202) {
          setUploadProgress(((chunkIndex + 1) / totalChunks) * 100);
          console.log(`${((chunkIndex + 1) / totalChunks) * 100} %`);
        } else if (resp.status === 201) {
          console.log("Transfert terminé");
          setUploadProgress(100);
          console.log(`100%`);
          break;
        } else {
          console.error("Failed to upload chunk");
          break;
        }
      } catch (error) {
        console.error("Error uploading file chunk:", error);
      }
    }
  };

  const downloadFile = async (uploadId: string, fileName: string) => {
    console.log(uploadId);
    try {
      const res = await APIService.downlaodFile(uploadId);
      const blob = new Blob([res.data], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);

      // Detect the file type and create the appropriate element
      const fileType = blob.type.split("/")[0];
      let element;
      console.log(fileType);

      // if (fileType === 'video') {
      //   element = document.createElement('video');
      //   element.controls = true;
      // } else if (fileType === 'audio') {
      //   element = document.createElement('audio');
      //   element.controls = true;
      // } else {
      //   element = document.createElement('a');
      //   element.setAttribute('download', fileName);
      // }
      element = document.createElement("a");
      element.href = url;
      document.body.appendChild(element);
      element.click();
      element.remove();
      console.log(element);

      // const decryptedFileData = CryptoJS.AES.decrypt(
      //   CryptoJS.lib.WordArray.create(res.data),'key').toString(CryptoJS.enc.Utf8);

      // saveAs(blob, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  if (!user) {
    localStorage.removeItem("user");
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <NavBar />
      <div className="row d-flex">
        <div className="">
          <h4>Online users list</h4>
          {users
            ?.filter((u: IUserModel) => u.telephone !== user?.telephone)
            .map((u: IUserModel, idx: number) => {
              return (
                <li key={idx} onClick={() => selectUser(u)}>
                  {" "}
                  {u.last_name}
                </li>
              );
            })}
        </div>
        <hr />
        <div className="col-4">
          <h4>Conversation list</h4>
          {conversations?.map((item: IConversation, idx: number) => (
            <div onClick={() => selectConversation(item)} key={idx}>
              <div className="row d-flex">
                {/* <span className="text-sm">
                  is currently
                  {onlines?.includes(item.other_user.telephone)
                    ? " online"
                    : " offline"}
                </span> */}
                <Conversation conversation={item} />
                {otherTyping && <span> typing... </span>}
                <hr />
              </div>
            </div>
          ))}
        </div>

        <div
          data-bs-spy="scroll"
          data-bs-target="#navbar-example2"
          data-bs-offset="0"
          className="scrollspy-example col-7"
          tabIndex="0"
        >
          <InfiniteScroll
            dataLength={messageHistory.length}
            next={fetchMessages}
            inverse={true}
            loader={<ChatLoader />}
            hasMore={hasMoreMessage}
            scrollableTarget="scrollableDiv"
          >
            {/* {messageHistory.length > 0
              ? messageHistory?.map((message: IMessage, idx: number) => (
                  <Message
                    key={idx}
                    message={message}
                    downloadFile={downloadFile}
                    sharedKey={sharedKey!}
                  />
                ))
              : ""} */}
          </InfiniteScroll>
        </div>
      </div>
      <div className="footer"></div>
      <footer className="footer fixed-bottom">
        <div className="container text-center">
          <form onSubmit={handleOnSubmit}>
            <div className="row d-flex">
              <div className="col-2"></div>
              <input
                type="text"
                onChange={handleOnChange}
                name="message"
                value={state.message}
                className="col-8"
                ref={inputReference}
              />
              {state.message.trim() ? (
                <button type="submit" className="btn btn-primary col-1">
                  Send
                </button>
              ) : (
                <button
                  type="submit"
                  disabled
                  className="btn btn-primary col-1 disabled"
                >
                  Send
                </button>
              )}
            </div>
          </form>

          <hr />
        </div>
      </footer>

      <div>
        <input type="file" onChange={handleFileUpload} />
        {file && <button onClick={uploadFile}>Upload</button>}
        <progress value={uploadProgress} max="100" />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default ChatPage;
