import React, { ReactElement, useCallback, useContext, useState, createContext, useEffect, FC } from 'react'
import ProfileImage from '../assets/icons/chatLogo.png'
import { IntlProvider } from "react-intl";
import { useRouter } from "next/router";
import { getInitialQuestion, AnswerTheQuestion, postConversation, getInterviewDetails } from '../services/aiInterviewQuestion'
import toast from 'react-hot-toast';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';

interface QuestionSkills {
  skill: string;
  question: string;
  fundamental_core: any;
  voice_url: any;
}

type ContextType = {
  messages: any[],
  setMessages: React.Dispatch<React.SetStateAction<string[]>>,
  loading: boolean,
  setLoading: (arg: boolean) => void,
  isMsgReceiving: boolean,
  setIsMsgReceiving: (arg: boolean) => void,
  sendMessage: (text: string, media?: any) => void,
  locale: any,
  setLocale: any,
  localeMsgs: any,
  userId: string,
  userName: string,
  interviewPercentage: number,
  setInterviewPercentage: (arg: number) => void
  isChatVisible: boolean,
  setIsChatVisible: (arg: boolean) => void,
  questionSkills: QuestionSkills,
  setQuestionSkills: React.Dispatch<React.SetStateAction<QuestionSkills>>,
  isTypeWriterStopped: boolean,
  setIsTypeWriterStopped: (arg: boolean) => void
}

// Define your initial context value
const initialContextValue: ContextType = {
  messages: [],
  setMessages: () => { },
  loading: false,
  setLoading: () => { },
  isMsgReceiving: false,
  setIsMsgReceiving: () => { },
  sendMessage: () => { },
  locale: '',
  setLocale: () => { },
  localeMsgs: '',
  userId: '',
  userName: '',
  interviewPercentage: 0,
  setInterviewPercentage: () => { },
  isChatVisible: true,
  setIsChatVisible: () => {},
  questionSkills: {skill: "", question: '', fundamental_core: null, voice_url: null},
  setQuestionSkills: () => { },
  isTypeWriterStopped: false,
  setIsTypeWriterStopped: () => {},
}

function loadMessages(locale: string) {
  switch (locale) {
    case "en":
      return import("../../lang/en.json");
    case "hi":
      return import("../../lang/hi.json");
    case "od":
      return import("../../lang/od.json");
    default:
      return import("../../lang/en.json");
  }
}

const ChatProvider = createContext<ContextType>(initialContextValue)

interface PromptData {
  prompt: string | null;
  bot: any;
}

const ChatContext: FC<{
  locale: any;
  localeMsgs: any;
  setLocale: any;
  userObjId: any;
  children: ReactElement;
}> = ({ locale, children, userObjId, localeMsgs, setLocale }) => {
  const [list, setList] = useState<PromptData[]>([])
  const [messages, setMessages] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [isMsgReceiving, setIsMsgReceiving] = useState(false);
  const [userId, setUserId] = useState(userObjId);
  const [userName, setUserName] = useState("");
  const [interviewPercentage, setInterviewPercentage] = useState(0)
  const [conversationQuestion, setConversationQuestion] = useState(false)
  const router = useRouter();
  const { token, jobid, candidate_id } = router.query;
  const [isChatVisible, setIsChatVisible] = useState(true)
  const [isTypeWriterStopped, setIsTypeWriterStopped] = useState(false);
  const [questionSkills, setQuestionSkills] = useState<any>({
    skill: "",
    question: '',
    fundamental_core: null,
    voice_url: null
  })

//  const getAudioUrl = async (text: string) => {
//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/ai/text-speech/`, { input: text, voice: 'nova' });

//       return response?.data;
//     } catch (e) {
//       console.log('error while calling t2s api', e)
//     }
//   } 

//   const handleaudio = async (message) =>{
//   const resp = await getAudioUrl(message);
//     console.log('audio url', resp);
//     // Create a new Audio object with the URL
//     const audio = new Audio(resp?.detail);
//     await audio.play();
//   }

  const handleInitialQuestion = async () => {
    setLoading(true)
    try {
      const res = await getInitialQuestion(candidate_id, jobid);
      console.log('response for question', res)
      // handleaudio(res?.Question)
      setQuestionSkills({
        question: res?.Question,
        skill: res?.skill,
        fundamental_core: res?.fundamental_core,
        voice_url: res?.voice_url,
      })
      setMessages((prev: any) => [
        ...prev.map((prevMsg: any) => ({ ...prevMsg })),
        {
          message: res?.Question,
          position: "left",
          user: { avatar: ProfileImage?.src },
          skill: res?.skill
        },
      ]);
      setIsMsgReceiving(false);
      setLoading(false);
    } catch (e) {
      console.log('error while calling get question api:-', e)
      setTimeout(() => {
        handleInitialQuestion()
      }, 3000)
    }
  }

//   const handleInitialQuestion = async () => {
//   try {
//     const res = await getInitialQuestion(candidate_id, jobid);
//     console.log('response for question', res);

//     // Replace newline characters with <br> tags
//     const formattedQuestion = res?.Question?.replace(/\n/g, '<br />');

//     setQuestionSkills({
//       question: formattedQuestion, // Use formatted question here
//       skill: res?.skill,
//       fundamental_core: res?.fundamental_core,
//     });

//     setMessages((prev: any) => [
//       ...prev.map((prevMsg: any) => ({ ...prevMsg })),
//       {
//         message: formattedQuestion, // Use formatted question here
//         position: "left",
//         user: { avatar: ProfileImage?.src },
//         skill: res?.skill,
//       },
//     ]);

//     setIsMsgReceiving(false);
//     setLoading(false);
//   } catch (e) {
//     console.log('error while calling get question api:-', e);
//     setTimeout(() => {
//       handleInitialQuestion();
//     }, 3000);
//   }
// };

  const handleAnsTheQuestion = async (req: any) => {
    try {
      const resp = await AnswerTheQuestion(req)
    } catch (e) {
      console.log('error while calling answer the question api', e)
    }
  }

  const handleConversation = async (req: any) => {
    try {
      const resp = await postConversation(req)
      return resp;
    } catch (e) {
      console.log('error while calling conversation api', e)
    }
  }

  //@ts-ignore
  const sendMessage = useCallback(
    async (text: string, media: any) => {
      console.log("holai:", { text, media })

      if (!text?.trim() || text?.trim() == '\n') {
        toast.error('Please type answer!')
        return
      }
      setIsMsgReceiving(true);
      setLoading(true);
      //@ts-ignore
      setMessages((prev: any) => [
        ...prev.map((prevMsg: any) => ({ ...prevMsg })),
        {
          message: text,
          position: "right",
        },
      ]);

      const conversationReq = {
        job_id: jobid,
        candidate_id: candidate_id,
        question: questionSkills?.question,
        skill: questionSkills?.skill,
        fundamental_core: questionSkills?.fundamental_core,
        response: text
      }

      let req = {
        job_description: jobid,
        candidate: candidate_id,
        skill: questionSkills?.skill,
        fundamental_core: questionSkills?.fundamental_core,
        question_answer: [
          {
            question: questionSkills?.question,
            answer: text,
            conversation_question: conversationQuestion,
          }
        ]
      }
      setIsTypeWriterStopped(false);

      const conversationApiResp = await handleConversation(conversationReq)
      console.log('conversationApiResp======', conversationApiResp)
      if (conversationApiResp?.conversation_question && conversationApiResp?.answer) {
        // @ts-ignore
        req.question_answer[0] = {
          question: conversationApiResp?.current_question,
          answer: text,
          conversation_question: conversationQuestion
        }
        
        const resp = await handleAnsTheQuestion(req);

        setQuestionSkills({
          question: conversationApiResp?.new_question,
          skill: conversationApiResp?.skill,
          fundamental_core: false,
          voice_url: conversationApiResp?.voice_url,
        })

        setMessages((prev: any) => [
          ...prev.map((prevMsg: any) => ({ ...prevMsg })),
          {
            message: conversationApiResp?.new_question,
            position: "left",
            user: { avatar: ProfileImage?.src },
            skill: conversationApiResp?.skill
          },
        ]);
        setIsMsgReceiving(false);
        setLoading(false);
      } else if (conversationApiResp?.answer) {
        const resp = await handleAnsTheQuestion(req)
        const questionApi = await handleInitialQuestion()
      } else if (conversationApiResp?.skip_question) {
        const questionApi = await handleInitialQuestion()
      } else if (conversationApiResp?.skip_question === false &&
        conversationApiResp?.answer === false &&
        conversationApiResp?.conversation_question === false) {
        setQuestionSkills({
          question: conversationApiResp?.question,
          skill: conversationApiResp?.skill,
          fundamental_core: false
        })
        setMessages((prev: any) => [
          ...prev.map((prevMsg: any) => ({ ...prevMsg })),
          {
            message: conversationApiResp?.question,
            position: "left",
            user: { avatar: ProfileImage?.src },
            skill: conversationApiResp?.skill
          },
        ]);
        setIsMsgReceiving(false);
        setLoading(false);
      } else {
        const resp = await handleAnsTheQuestion(req)
        const questionApi = await handleInitialQuestion()
      }

      if (conversationApiResp?.conversation_question) {
        setConversationQuestion(conversationApiResp?.conversation_question)
      } else {
        setConversationQuestion(false)
      }
    }
  );

  const handleConversationHistory = async () => {
    try {
      const resp = await getInterviewDetails(candidate_id)
      const conversation = resp?.data?.conversation?.flatMap((item: any) => [
        {
          message: item.questions, position: "left",
          user: { avatar: ProfileImage?.src },
        },
        { message: item.response, position: "right" },

      ])
      setMessages((prev: any) => [
        ...prev.map((prevMsg: any) => ({ ...prevMsg })),
        ...conversation
      ]);

      // setMessages((pre) => [...conversation, ...pre])
      console.log('conversation4', conversation)
    } catch (e) {
      console.log('error while calling conversation history api:-', e)
    }
  }

  const handleInitialCall = async () => {
    await handleConversationHistory()
    await handleInitialQuestion()
  }

  useEffect(() => {
    console.log('inside use question')
    if (jobid && candidate_id) {
      handleInitialCall()

    }
  }, [jobid, candidate_id])

  return (

    <ChatProvider.Provider
      value={{
        messages,
        setMessages,
        loading,
        setLoading,
        isMsgReceiving,
        setIsMsgReceiving,
        sendMessage,
        locale,
        setLocale,
        localeMsgs,
        userId,
        userName,
        interviewPercentage,
        setInterviewPercentage,
        isChatVisible,
        setIsChatVisible,
        questionSkills,
        setQuestionSkills,
        isTypeWriterStopped,
        setIsTypeWriterStopped,
      }}>
      <IntlProvider
        locale={locale ?? 'en'}
        //@ts-ignore
        messages={localeMsgs}>
        {children}
      </IntlProvider>
    </ChatProvider.Provider>
  )
}


// export default ChatContext

const SSR: FC<{ children: ReactElement }> = ({ children }) => {
  const [locale, setLocale] = useState("");
  const [userId, setUserId] = useState("");
  const [localeMsgs, setLocaleMsgs] = useState<Record<string, string> | null>(
    null
  );

  const fetchUserId = async () => {
    const userId = await localStorage.getItem('userId') || ""
    await setUserId(userId);
  }



  useEffect(() => {
    loadMessages(locale).then((res) => {
      //@ts-ignore
      setLocaleMsgs(res);
    });
    fetchUserId()
  }, [locale]);

  if (typeof window === "undefined") return null;
  return (
    //@ts-ignore
    <IntlProvider locale={locale} messages={localeMsgs}>
      <ChatContext
        locale={locale ?? 'en'}
        setLocale={setLocale}
        localeMsgs={localeMsgs}
        userObjId={userId}
      >
        {children}
      </ChatContext>
    </IntlProvider>
  );
};
export default SSR;

export const useChatContext = () => useContext(ChatProvider);
