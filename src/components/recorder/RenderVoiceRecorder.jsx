import { useState, useRef, useEffect } from "react";
import { Backdrop, CircularProgress } from "@material-ui/core";
import toast from "react-hot-toast";
import axios from "axios";
import { Box, Button } from "@chakra-ui/react";
import { CiMicrophoneOn } from "react-icons/ci";
import { LuMic } from "react-icons/lu";
import Plain from "../../assets/svg/Plain.svg";
import Delete from "../../assets/svg/Delete.svg";
import EllipseInterview from "../../assets/svg/EllipseInterview.svg";
import Stopbutton from "../../assets/svg/Stopbutton.svg";
import { BsSend } from "react-icons/bs";
import { useChatContext } from "../../context/ChatContext";
import dynamic from "next/dynamic";
import voiceAnimation from "../../assets/animations/voiceAnimation.json"
import InterviewScreen from "../interview/InterviewScreen";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const RenderVoiceRecorder = ({
  setInputMsg,
  inputAnswer,
  isRecordingStart,
  setIsRecordingStart,
  handleSend
}) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  const mediaRecorderRef = useRef(null); // Use ref to keep track of mediaRecorder
  const recordingStartRef = useRef(isRecordingStart); // Ref to track the recording state
  const [apiCallStatus, setApiCallStatus] = useState("ideal");
  const [isPause, setIsPause] = useState(false);
  const audioRef = (useRef < HTMLAudioElement) | (null > null);

  const {
    messages,
    sendMessage,
    isMsgReceiving,
    setMessages,
    setLocale,
    loading,
  } = useChatContext();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          stopTimer();
          setApiCallStatus("processing");
          handleTranscription(event.data);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder; // Set recorder to ref
    } catch (error) {
      setApiCallStatus("error");
      toast.error("Could not access microphone");
      console.error("Error accessing microphone:", error);
    }
  };

  const handleSend2 = () => {
    if (inputAnswer) {
      sendMessage(inputAnswer);
      //setInputAnswer('')
    }
  };

  const handleDelete = () => {
    if (inputAnswer) {
      setInputAnswer("");
    }
  };

  const handleInputChange1 = () => {
    //stopQuestionAudio();
    handlePause();
  };

  const handlePause = () => {
    // console.log("Pratik" + audioRef);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stopRecording = async () => {
    setIsRecordingStart(false);
    recordingStartRef.current = false;
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsPause(false);
      setSeconds(0);
    }
  };

  const handleStartRecording = () => {
    startRecording();

    startTimer();
    setIsRecordingStart(true);
    recordingStartRef.current = true;
  };

  const handleKeyDown = (event) => {
    // Check if Shift + Space is pressed
    if (event && event.code === "Space" && event.shiftKey) {
      event.preventDefault(); // Prevent default space action

      // Toggle recording based on the current state
      if (recordingStartRef.current) {
        stopRecording(); // Stop the recording if it's already started
      } else {
        handleStartRecording(); // Start recording if not already recording
      }
    }
  };

  // Use effect to add and remove event listener for keydown
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputAnswer]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputAnswer]);

  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const handleTranscription = async (blobData) => {
    if (!blobData) {
      toast.error("No audio recorded");
      return;
    }

    const formData = new FormData();
    formData.append("file", blobData, "audio.wav");

    try {
      const resp = await axios.post(`/api/speechToText`, formData);
      setInputMsg((prev) => prev + resp?.data?.message?.text);
      setApiCallStatus("success");
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast.error("Error: Failed to transcribe audio");
      setApiCallStatus("error");
    }
  };


  const handledeleteAudioRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopTimer()
    setSeconds(0);
    // startRecording();
    // startTimer();
    setIsRecordingStart(false);
    recordingStartRef.current = false;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <>
      {apiCallStatus === "processing" && (
        <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {isRecordingStart ? (
        <>
          {inputAnswer ? (
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-start"
              marginleft="20px"
              // marginTop={"100px"}
              width={"100%"}
              padding={"20px 20px"}
            >
              <Box
                sx={{
                  color: "#F3F3F3",
                  fontSize: "14px",
                  fontWeight: 600,
                  textAlign: "center",
                  opacity: 0.4,
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "10px",
                  width: "33%"
                  // marginTop: "80px",
                  // marginBottom: "20px",
                }}
              >
                {`We'll`} transcribe your answer once you stop recording
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width={"33%"}
                // marginleft="20px"
                // marginTop={"70px"}
              >
                <Box>
                  <Button
                    size="small"
                    bg="#282C36"
                    _hover="#282C36"
                    marginRight={"20px"}
                    //position={'fixed'}
                    //padding="9px 50px"
                    _active="#282C36"
                    borderRadius="40px"
                    color="#EB7E76"
                    marginBottom="20px"
                    //marginTop="50px"
                    onClick={handledeleteAudioRecording}
                  >
                    {<img src={Delete.src} alt="icon" />}
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "0px",
                  }}
                >
                  <Button
                    size="small"
                    bg="#282C36"
                    _hover={{ backgroundColor: "#282C36" }}
                    _active={{ backgroundColor: "#282C36" }}
                    borderRadius="40px"
                    color="#F3F3F3"
                    fontSize="12px"
                    fontWeight={600}
                    onClick={stopRecording}
                  >
                    <Lottie animationData={voiceAnimation} loop={true} autoPlay={true} style={{height: "45px", marginLeft: "10px"}}/>
                    <img
                      src={EllipseInterview.src}
                      alt="icon"
                      // style={{ marginLeft: "20px" }}
                    />
                    <Box style={{ marginLeft: "10px" }}>
                      {formatTime(seconds)}
                    </Box>
                    <img
                      src={Stopbutton.src}
                      alt="icon"
                      style={{ marginLeft: "20px" }}
                    />
                  </Button>

                  <Box
                    sx={{
                      fontFamily: "Inter-regular",
                      fontSize: "10px",
                      fontWeight: 400,
                      lineHeight: "12.94px",
                      textAlign: "center",
                      color: "#F3F3F3 !important",
                      marginTop: "10px",
                    }}
                  >
                    Stop recording [shift + space]
                  </Box>
                </Box>
              </Box>
              <Box></Box>
            </Box>
          ) : (
            <Box sx={{display: "flex", flexDirection: "row", width: "100%", padding: "20px 20px", alignItems: "center"}}>
              <Box sx={{display: "flex", width: "100%"}}>
                <Box
                  sx={{
                    color: "#F3F3F3",
                    fontSize: "18px",
                    fontWeight: 600,
                    textAlign: "center",
                    opacity: 0.4,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                    width: "33%",
                    justifyContent: "flex-start"
                    // marginTop: "80px",
                    // marginBottom: "20px",
                  }}
                >
                  {`We'll`} transcribe your answer once you stop recording
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", width: "33%"}}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Button
                    size="small"
                    bg="#282C36"
                    _hover="#282C36"
                    // position={'fixed'}
                    //padding="9px 50px"
                    _active="#282C36"
                    borderRadius="40px"
                    color="#EB7E76"
                    //marginBottom="20px"
                    marginRight={"20px"}
                    // marginTop="50px"
                    onClick={() => {
                      handledeleteAudioRecording();
                    }}
                  >
                    {<img src={Delete.src} alt="icon" />}
                  </Button>
                  <Button
                    size="small"
                    bg="#282C36"
                    _hover={{ backgroundColor: "#282C36" }}
                    _active={{ backgroundColor: "#282C36" }}
                    borderRadius="40px"
                    color="#F3F3F3"
                    fontSize="12px"
                    fontWeight={600}
                    onClick={stopRecording}
                  >
                    <Lottie animationData={voiceAnimation} loop={true} autoPlay={true} style={{height: "45px", marginLeft: "10px"}}/>
                    <img
                      src={EllipseInterview.src}
                      alt="icon"
                      // style={{ marginLeft: "20px" }}
                    />
                    <Box style={{ marginLeft: "10px" }}>
                      {formatTime(seconds)}
                    </Box>
                    <img
                      src={Stopbutton.src}
                      alt="icon"
                      style={{ marginLeft: "20px" }}
                    />
                  </Button>
                </Box>
                <Box
                  sx={{
                    fontFamily: "Inter-regular",
                    fontSize: "10px",
                    fontWeight: 400,
                    lineHeight: "12.94px",
                    textAlign: "center",
                    color: "#F3F3F3 !important",
                    marginTop: "10px",
                    marginLeft: "80px",
                  }}
                >
                  Stop recording [space]
                </Box>
                </Box>
                {/* <Box>sdfasdf</Box> */}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "100px",
                }}
              >
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%", height: "100%" }}
        >
         

          {/* Microphone Section */}
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="12px"

            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-between",
              padding: "0px 15px 0px 10px",
              alignItems: "center",
            }}
          >
            {!isRecordingStart && (
            <Box
              sx={{
                color: "#E5E5E5",
                fontSize: "14px",
                textAlign: "left",
                paddingLeft: "10px",
                fontWeight: "400"
              }}
            >
              Press mic to record <br />
              [shift+enter] for a new line
            </Box>
          )}
            {/* Microphone Button */}
            <Box>
            <Button
              size="small"
              bg={inputAnswer ? "#282C36" : "#2877EE"}
              _hover={inputAnswer ? "#282C36" : "#2877EE"}
              padding="8px 55px"
              marginTop={"5px"}
              height={inputAnswer ? "30px" : "40px"}
              _active={inputAnswer ? "#282C36" : "#2877EE"}
              borderRadius={"40px"}
              color={"#F3F3F3"}
              background={"#007AFF"}
              fontSize="16px"
              fontWeight={400}
              onClick={() => {
                handleStartRecording();
                handleInputChange1();
                handleKeyDown();
              }}
              sx={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {/* Text first */}
              {inputAnswer ? " " : "Answer"}

              {/* Icon on the right */}
              <CiMicrophoneOn size={22} color="#F3F3F3" />
            </Button>

            {/* Text below the microphone button */}
            <Box
              sx={{
                color: "#E5E5E5",
                fontSize: "10px",
                textAlign: "center",
                marginTop: "10px",
                fontWeight: "400"
              }}
            >
              Start recording {`[Shift + Space]`}
            </Box>
            </Box>
            { !inputAnswer && <Box
              sx={{
                fontWeight: "400",
                fontSizeL : "18px",
                color: "#F3F3F3"
              }}
            >
              Either type or record your answer 
            </Box>}

            {inputAnswer && !isRecordingStart && (
                  <Box 
                  // sx={{ marginLeft: 'auto' }}
                  >
                      <Button
                          size="small"
                          bg="#6DAA39"
                          _hover="#2877EE"
                          padding="8px 50px"
                          _active={"#2877EE"}
                          borderRadius={"40px"}
                          color={"#F3F3F3"}
                          fontSize="14px"
                          fontWeight={600}
                          rightIcon={<BsSend size={20} color="#F3F3F3" />}
                          onClick={handleSend}
                      >
                          Send
                      </Button>
                      <Box
                          sx={{
                              color: "#E5E5E5",
                              fontSize: "10px",
                              marginTop: "12px",
                              textAlign: "center",
                          }}
                      >
                          {`[Enter]`} to Send
                      </Box>
                  </Box>
              )}
          </Box>
        </Box >
      )}
    </>
  );
};

export default RenderVoiceRecorder;
