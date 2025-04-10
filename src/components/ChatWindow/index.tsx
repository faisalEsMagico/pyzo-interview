import React, { useContext } from "react";
import styles from "./index.module.css";
interface chatWindowProps {
  currentMessageObj: {
    user: string;
    phoneNumber: string | null;
    messages: any[];
  };
  toClearChat: () => void;
  messages: any[];
  username: string;
  selected: (option: { key: string; text: string; backmenu: boolean }) => void;
  toSendMessage: (text: string, media: any) => void;
  currentUser: { name: string; number: string | null };
  sendLocation: (location: string) => void;
  toShowChats: (event: React.MouseEvent) => void;
}

const ChatWindow: React.FC<chatWindowProps> = () => {
  
  return (
    <>
      <div className={styles.container}>
        {/* <ChatUiWindow /> */}
      </div>
    </>

  );
};

export default ChatWindow;
