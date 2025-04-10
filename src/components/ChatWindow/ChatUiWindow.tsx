import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getMsgType } from "../../utils/getMsgType";

import { useChatContext } from "../../context/ChatContext";
import ChatMessageItem from "../chat-message-item";
import openai from "openai";
import sidebarleft from '../../assets/svg/sidebarleft.svg';
import { Box } from "@chakra-ui/react";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
// @ts-ignore
openai.apiKey = OPENAI_API_KEY;

const ChatUiWindow: React.FC = () => {
  const { messages, sendMessage, isMsgReceiving, setMessages, setLocale, isChatVisible, setIsChatVisible } = useChatContext()
  const messagesEndRef = useRef(null);

  const normalizeMsgs = useMemo(() =>
    messages?.map((msg: any) => ({
      type: getMsgType(msg),
      content: { text: msg?.text, data: { ...msg } },
      position: msg?.position ?? "right",
    })),
    [messages]
  );

  const msgToRender = useMemo(() => {
   
    return isMsgReceiving
      ? [
        ...normalizeMsgs,
        {
          type: "loader",
          position: "left",
          botUuid: "1",
        },
      ]
      : normalizeMsgs;
  }, [isMsgReceiving, normalizeMsgs]);


  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible); 
  };

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => {
    if (!isChatVisible) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      // @ts-ignore
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [msgToRender]); 

  return (
    <Box sx={{ position: "relative", width: "100%", }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: "20px",
          borderBottom: "1px solid #2C313B",
          width: "100%"
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <img
              src={sidebarleft.src}
              alt='Open Conversation History'
              style={{
                objectFit: 'contain',
                marginRight: '10px',
                backgroundColor: 'rgba(40, 44, 54, 1)',
                padding: '10px',
                borderRadius: '7px',
                cursor: 'pointer'
              }}
              onClick={toggleChatVisibility}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            {isHovering && !isChatVisible && (
              <span style={{
                fontSize: '16px',
                fontWeight: 600,
                color: "#F3F3F3",
                backgroundColor: 'black',
                padding: '9px',
                borderRadius: '7px',
                marginLeft: '10px',
                whiteSpace: 'nowrap',
                position: "absolute",
                left: "40px"
              }}>
                Open Conversation History
              </span>
            )}
          </Box>
          {isChatVisible && (
            <span style={{
              fontSize: '16px',
              fontWeight: 600,
              color: "#F3F3F3",
              //backgroundColor: 'black',
              padding: '9px',
              borderRadius: '7px',
              marginLeft: '10px',

            }}>
              Conversation history
            </span>
          )}
        </Box>
      </Box>
      <div
        style={{
          height: 'auto',
          width: "100%",
          backgroundColor: "#141926",
          overflowY: 'auto',
          marginBottom: '100px',
          maxHeight: '80vh',
          overflowX: 'hidden'
        }}
      >
        {isChatVisible &&
          msgToRender.map((msg, index) => (
            <ChatMessageItem key={index} message={msg} />
          ))}
        <div ref={messagesEndRef} />
      </div>

    </Box>
  );
};

export default ChatUiWindow;
