import { useSelector } from 'react-redux'
import { IMessage } from "../models/MessageModel";
import { authSelectorState } from '../store/selectors/AuthSelector';
import { decryptTextMessage } from '../utils/utils';


export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

export default function Message({ message, downloadFile, sharedKey }: {message: IMessage, downloadFile: any, sharedKey: string }){
    const { user } = useSelector(authSelectorState);
    console.log(message)
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString().slice(0, 4) + date.toLocaleTimeString().slice(7, 10);
    }

    const handleDecryptTextMessage = (encryptedMessage: string) => {
        try {
          const decrypted = decryptTextMessage(sharedKey!, encryptedMessage);
          return decrypted;
        } catch (error) {
          console.error("Decryption failed:", error);
        }
      };
    

    return(
    <>
        <li className={`mt-1 mb-1 d-flex ${user!.telephone === message.receiver?.telephone ? "justify-content-start" : "justify-content-end"}`}>
            <div className={`position-relative max-w-xl rounded-lg d-flex px-2 py-1 text-gray-700 shadow ${user!.telephone === message.receiver?.telephone ? "" : "bg-secondary bg-gradient"}`}>
                <div className="d-flex align-items-end j" >
                    <span  style={{maxWidth: "500px"}}>
                        <span className="d-block text-black">{
                            (message.text_content && sharedKey) 
                                ? handleDecryptTextMessage(message.text_content) 
                                : message?.text_content}
                        </span>
                    </span>
                    <span  style={{maxWidth: "500px"}}>
                        <span className="d-block text-black">
                            { message.file ? 
                            
                        <button onClick={() => downloadFile(message.file.upload_id, message.file.file_name)}>Download</button>: ''
                    }
                    <span id="lecteur"></span>
                        </span>
                    </span>
                    <span className="ms-2" style={{ fontSize: "0.6rem", lineHeight: "1rem" }}>
                        {formatTimestamp(message.created_at)}
                    </span>
                </div>
            </div>
        </li>
        {/* <hr /> */}
    </>)
 }