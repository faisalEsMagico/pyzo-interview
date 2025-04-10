import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import dynamic from "next/dynamic";
import { Box, Button, Spinner } from '@chakra-ui/react';
import companyLogo from '../../assets/images/companyLogo.png'
import { PiSpeakerSimpleHigh, PiSpeakerSimpleSlashLight } from "react-icons/pi";
import { BsSend } from "react-icons/bs";
import InputField from '../ui-components/InputField';
import InterviewTopBar from './InterviewTopBar';
import VideoScreen from './VideoScreen';
import { useChatContext } from '../../context/ChatContext';
import RenderVoiceRecorder from '../recorder/RenderVoiceRecorder';
import InterviewEndScreen from './InterviewEndScreen';
import toast from 'react-hot-toast';
import axios from 'axios';
import historyBg from '../../assets/images/chatHistoryBg.png'
import { Typewriter } from 'react-simple-typewriter';
import Play from '../../assets/svg/Play.svg';
import Pause from '../../assets/svg/Pause.svg';
import Delete1 from '../../assets/svg/Delete1.svg';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonLoader } from '../SkeletonLoader';
import KeyboardShortcutsPopup from './KeyboardShortcutsPopup';

const ChatUiWindow = dynamic(
    () => import("../../components/ChatWindow/ChatUiWindow"),
    { ssr: false }
);

const InterviewScreen = ({
    handleStopRecording,
    seconds,
    handleSeconds,
    minutes,
    handleMinutes,
    hours,
    handleHours,
    interviewDetails
}: any) => {
    const { messages, sendMessage, isMsgReceiving, setMessages, setLocale, loading, questionSkills, setQuestionSkills, isChatVisible, setIsChatVisible, isTypeWriterStopped, setIsTypeWriterStopped } = useChatContext()
    const questionAudioRef = useRef(null);
    const [inputAnswer, setInputAnswer] = useState('')
    const [isRecordingStart, setIsRecordingStart] = useState(false);
    const question = messages[messages?.length - 1]?.position === 'left' && messages?.length > 0 ? messages[messages.length - 1]?.message : ''

    const skill = messages[messages?.length - 1]?.position === 'left' && messages?.length > 0 ? messages[messages.length - 1]?.skill : ''
    const [isPlay, setIsPlay] = useState(false)
    const [readyToCall, setReadyToCall] = useState(true)
    const [spacePressedTime, setSpacePressedTime] = useState(0);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const inputRef = useRef(null);
    const inputRef1 = useRef(null);
    const [startTyping, setStartTyping] = useState(false);
    // const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [key, setKey] = useState(0);
    const [textareaHeight, setTextareaHeight] = useState(100);
    const answerContainerRef = useRef<HTMLDivElement | null>(null);
    const [answerContainerRows, setAnswerContainerRows] = useState<number>(5);
    const [isShortcutPopupOpen, setIsShortcutPopupOpen] = useState(false);
    const inputAnswerRef = useRef<HTMLTextAreaElement | null>(null);
    const [isShortcutPopupShown, setIsShortcutPopupShown] = useState(false);

    const getAudioUrl = async (text: string) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/ai/text-speech/`, { input: text, voice: 'nova' });
            setStartTyping(true);
            return response?.data;
        } catch (e) {
            console.log('error while calling t2s api', e)
        }
    }

    const handleaudio = async (message: string) => {
        if (question) {
            setReadyToCall(true);
            setStartTyping(true)
            if (!audioRef.current) {
                const audio = new Audio(questionSkills?.voice_url);
                audioRef.current = audio;
            } else if (audioRef.current.src !== questionSkills?.voice_url) {
                // Pause and reset the current audio if the source URL changes
                audioRef.current.pause();
                audioRef.current = new Audio(questionSkills?.voice_url);  // Assign new audio with updated URL
            }
            audioRef.current.onended = () => {
                console.log("Audio finished playing");
                setReadyToCall(false); // Change the variable here to indicate the audio has finished
            };

            // 1. Play the audio from where it was paused
            await audioRef.current.play();

        }

    };

    const handleEditAnswer = () => {
        setIsShortcutPopupOpen(false);
        inputAnswerRef?.current?.focus();
    }

    const handlePopupSendAnswer = () => {
        setIsShortcutPopupOpen(false);
        handleSend();
    }
    const calculateSkeletonRows = () => {
        if (answerContainerRef) {
            const containerHeight = answerContainerRef?.current?.clientHeight;

            const rowHeight = 25;

            if (containerHeight) {
                setAnswerContainerRows(Math.floor(containerHeight / rowHeight))
            }
            console.log(containerHeight, "containerHeight")
        }
    }

    const handlePause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    // On type writer stopped typing
    const OnTypeWriterStopped = () => {
        setIsTypeWriterStopped(true);
    }



    const disableCopyPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        console.log('Copy-paste actions are disabled!');
    };

    const handleSend = () => {
        if (inputAnswer) {
            sendMessage(inputAnswer)
            setInputAnswer('')
        }
    }

    const handleDelete = () => {
        if (inputAnswer) {
            setInputAnswer('')
        }
    }

    const handleInputChange = (value) => {
        setInputAnswer(value);
        //stopQuestionAudio();  
        handlePause();
    };

    const stopQuestionAudio = () => {
        if (questionAudioRef.current && !questionAudioRef.current.paused) {

            questionAudioRef.current.pause();  // Pause the audio
            questionAudioRef.current.currentTime = 0;  // Reset audio to the beginning
        }
    };

    // Handle key down events
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                // Allow new line
                event.preventDefault();
                setInputAnswer((prev) => prev + '\n'); // Insert new line
            } else {
                // Send the message
                event.preventDefault();
                if ((messages.length <= 1) && (!isShortcutPopupShown)) {
                    setIsShortcutPopupOpen(true);
                    setIsShortcutPopupShown(true);
                    return;
                }
                handleSend();
            }
        }
    };

    useEffect(() => {
        // @ts-ignore
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            // @ts-ignore
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [sendMessage, setInputAnswer, inputAnswer]);

    useEffect(() => {
        // Focus the input field when the component mounts
        if (inputRef.current) {
            // @ts-ignore
            inputRef.current.focus();
            //console.log("Shivani");
        }

        handleaudio(question);
        setKey(prevKey => prevKey + 1);
    }, [question]);

    useEffect(() => {
        calculateSkeletonRows()
    }, [answerContainerRef.current?.clientHeight]);


    useEffect(() => {
        setIsTypeWriterStopped(false);
    }, [])

    return (
        <Box >
            <div style={{ backgroundColor: "#141926", width: "100%" }}>
                <InterviewTopBar
                    seconds={seconds}
                    handleSeconds={handleSeconds}
                    minutes={minutes}
                    handleMinutes={handleMinutes}
                    hours={hours}
                    handleHours={handleHours}
                    handleStopRecording={handleStopRecording}
                    logo={interviewDetails?.logo}
                    interviewPause={interviewDetails?.interviewPause}
                    jobTitle={interviewDetails?.applyingFor}
                    jobDescription={interviewDetails?.jobDescription}
                />
                <KeyboardShortcutsPopup isOpen={isShortcutPopupOpen} onClose={() => setIsShortcutPopupOpen(false)} setIsShortcutPopupOpen={setIsShortcutPopupOpen} handleEditAnswer={handleEditAnswer} handleSend={handlePopupSendAnswer} />
            </div>
            <div className={styles.interviewScreenContainer}>
                <Box style={{ backgroundColor: "#141926", width: isChatVisible ? "27%" : "auto", position: isChatVisible ? "relative" : "absolute", left: isChatVisible ? "auto" : "0" }}>
                    <img src={historyBg.src} alt=""
                        style={{
                            position: "absolute",
                            width: "100%",
                            zIndex: 10,
                            left: 0,
                            right: 0,
                            pointerEvents: 'none'
                        }} />
                    <ChatUiWindow />
                </Box>
                <Box
                    sx={{
                        backgroundColor: "#141926",
                        width: "73%",
                        height: "100vh",
                        paddingBottom: "5%",
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap"
                    }}
                >
                    <VideoScreen
                        companyLogo={companyLogo}
                        interviewDetails={interviewDetails}
                    />
                    {loading ? <Box
                        sx={{
                            borderRadius: "12px",
                            margin: "12px",
                            position: "relative",
                            backgroundColor: "#0D111B",
                            padding: "12px"
                        }}
                    >
                        <SkeletonLoader
                            lines={5}
                            widths={["99%", "65%", "75%", "85%", "95%"]}
                            baseColor="#58678F"
                            highlightColor="#36497A"
                            borderRadius="16px"
                        />
                    </Box> :
                        <Box sx={{
                            overflow: "auto",
                            margin: "5px  12px 2px 12px",
                            backgroundColor: "#0D111B",
                            borderRadius: "12px",
                            height: "18%",
                            flexGrow: "1"
                        }}>
                            <Box
                                sx={{
                                    padding: "0px 16px 16px 16px",
                                    border: "1px solid #374C82",
                                    borderRadius: "12px",
                                    overflowY: "auto",
                                    height: "100%"
                                }}
                            >
                                <Box
                                    sx={{
                                        color: "#F3F3F3",
                                        fontSize: "12px",
                                        display: 'flex',
                                        gap: "10px",
                                        opacity: 0.6,
                                        alignItems: 'center',
                                    }}
                                >
                                    {`Here's`} the Question
                                    <Box sx={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                                        {readyToCall ? (
                                            <>
                                                <img src={Pause.src} alt='pause icon' onClick={() => {
                                                    setReadyToCall(false);
                                                    if (inputRef.current) {
                                                        // @ts-ignore
                                                        inputRef.current.focus();
                                                    }
                                                    handlePause();
                                                }} />
                                            </>
                                        ) : (
                                            <>
                                                <img src={Play.src} alt='play icon'
                                                    onClick={() => {
                                                        setReadyToCall(true);
                                                        if (inputRef.current) {
                                                            // @ts-ignore
                                                            inputRef.current.focus();
                                                        }
                                                        handleaudio(question);
                                                    }}
                                                />
                                            </>
                                        )}
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        fontWeight: 400,
                                        fontSize: '16px',
                                        color: "#E5E5E5",
                                        marginTop: "5px",
                                        maxHeight: inputAnswer ? '100px' : "170px",
                                        overflow: "auto",
                                        lineHeight: '22px',
                                        borderRadius: "12px",
                                        paddingX: "15px"
                                    }}
                                    onCopy={disableCopyPaste}
                                    onCut={disableCopyPaste}
                                >
                                    {
                                        startTyping &&
                                        <Typewriter
                                            words={[question]}
                                            key={key}
                                            loop={false}
                                            cursor
                                            cursorStyle="|"
                                            typeSpeed={55}
                                            deleteSpeed={0}
                                            onDelay={OnTypeWriterStopped}
                                        />
                                    }
                                </Box>
                            </Box>
                        </Box>}
                    {
                        ((!skill) && (!loading)) ?
                            <InterviewEndScreen handleStopRecording={handleStopRecording} /> :
                            <Box
                                sx={{
                                    borderRadius: "12px",
                                    height: "28%",
                                    flexGrow: "1"
                                }}
                            >
                                <Box
                                    sx={{
                                        margin: "12px",
                                        height: "100%"
                                    }}
                                >
                                    <Box
                                        ref={answerContainerRef}
                                        sx={{
                                            position: "relative",
                                            borderRadius: "12px",
                                            backgroundColor: "#0D111B",
                                            height: "100%"
                                        }}>
                                        {(messages[messages?.length - 1]?.position === 'left' && !isRecordingStart) || (isRecordingStart && inputAnswer) || (loading) ?
                                            <>
                                                <Box sx={{
                                                    bgColor: "#374C82",
                                                    backgroundColor: ((inputAnswer) || (loading)) ? "#374C82" : "#0D111B",
                                                    borderRadius: "12px",
                                                    padding: "12px",
                                                    height: "100%",

                                                }}>
                                                    <Box
                                                        sx={{
                                                            color: "#F3F3F3",
                                                            fontSize: "12px",
                                                            display: 'flex',
                                                            justifyContent: ((inputAnswer) || (loading)) ? 'flex-start' : 'center',
                                                            alignItems: 'center',
                                                            gap: "10px",
                                                            opacity: 0.6,

                                                        }}
                                                    >
                                                        <span>
                                                            {((inputAnswer) && (!loading)) ? "Here’s your answer" : ''}
                                                        </span>
                                                        {(inputAnswer) && (
                                                            <img
                                                                src={Delete1.src}
                                                                alt="Delete icon"
                                                                style={{
                                                                    height: '32px',
                                                                    marginLeft: 'auto',
                                                                    display: 'block'
                                                                }}
                                                                onClick={handleDelete}
                                                            />
                                                        )}
                                                    </Box>
                                                    {loading && (<SkeletonLoader
                                                        lines={answerContainerRows}
                                                        widths={["99%", "65%", "75%", "85%", "95%", "99%", "65%", "75%", "85%", "95%", "99%", "65%", "75%", "85%", "95%", "99%", "65%", "75%", "85%", "95%"]}
                                                        baseColor="#58678F"
                                                        highlightColor="#36497A"
                                                        borderRadius="16px"
                                                    />)}
                                                    {!loading && (<textarea
                                                        value={inputAnswer}
                                                        onChange={(e) => handleInputChange(e.target.value)}
                                                        ref={inputAnswerRef}
                                                        placeholder="Here’s your answer"
                                                        style={{
                                                            width: '100%',
                                                            height: "85%",
                                                            backgroundColor: inputAnswer ? '#374C82' : 'transparent',
                                                            color: '#F3F3F3',
                                                            fontSize: '13px',
                                                            fontWeight: 400,
                                                            border: 'none',
                                                            outline: 'none',
                                                            resize: 'none',
                                                            overflowWrap: 'break-word',
                                                            wordWrap: 'break-word',
                                                            padding: '10px',
                                                        }}
                                                    />)}
                                                </Box>
                                            </> : <></>}
                                    </Box>
                                </Box>
                            </Box>
                    }

                    {skill && <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "16px",
                            marginTop: "20px",
                            zIndex: 1000,  
                            height: "10%",
                            flexGrow: 1
                        }}
                    >
                        {!loading && (<RenderVoiceRecorder
                            inputAnswer={inputAnswer}
                            setInputMsg={setInputAnswer}
                            isRecordingStart={isRecordingStart}
                            setIsRecordingStart={setIsRecordingStart}
                            handleSend={handleSend}
                        />)}
                    </Box>}
                </Box>
            </div >
        </Box>
    )
}

export default InterviewScreen