
import React, { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import useWebsocket, { ReadyState  } from 'react-use-websocket'
import { authSelectorState } from '../store/selectors/AuthSelector';
import { BASE_URL_WS } from '../services/Api';

const NotificationComponent: React.FC<{children: ReactNode }> = ({ children}) => {
    const { user } = useSelector(authSelectorState);
    const [unReadMessageCount, setUnReadMessageCount] = useState(0) 

    const { readyState } = useWebsocket(user? `${BASE_URL_WS}/notifications/` : null, {
        queryParams: {
            token: user ? user.token : ""
        },
        
        onOpen: () => {
            console.log("Connected to notification");
        },

        onClose: () => {
            console.log("notification closed");
        },

        onMessage: (e) => {
            const data = JSON.parse(e.data);
            switch (data.type) {
                default:
                  console.error("Unknown message type!");
                  break;
              }
        }
    })

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated"
      }[readyState];

  return (
    <div>{children}</div>
  )
}

export default NotificationComponent