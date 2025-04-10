import React, { useRef, useState } from "react";
import styles from "./index.module.css";
import { Box, Button, Checkbox, ListItem, UnorderedList } from "@chakra-ui/react";
import Webcam from "react-webcam";
import { CiMicrophoneOn } from "react-icons/ci";
import { CiMicrophoneOff } from "react-icons/ci";
import { PiVideoCameraLight } from "react-icons/pi";
import { PiVideoCameraSlash } from "react-icons/pi";
import relaxIcon from '../../assets/images/relaxIcon.png'
import companyLogo from '../../assets/images/companyLogo.png'
import { BsDot } from "react-icons/bs";

const instructions = [{
    heading: "General Guidelines", instruction: ['Make sure you’re in a well lit and silent area',
        'We know mobiles are the lifeline, but it can turn into a heartbreak if not used correctly. Ensure you’re giving the interview on your desktop or laptop. Avoid tablets, phones, and other touchscreen devices.',
        'A strong internet connection, 2 Mbps or faster, for an uninterrupted interview session.',
        'Enable your camera and microphone so that we can capture your answers. No hats, sunglasses, or face coverings (unless for religious or medical reasons).']
},
{
    heading: "What we’re fine with 😇",
    instruction: [
        'You carrying your ID card for self verification.',
        'Use of medically prescribed glasses or contacts.',
        'A clear water bottle'
    ]
},
{
    heading: 'What we’re not fine with ❌',
    instruction: [
        'Use of any other electronic devices during the interview.',
        'Getting distracted by external factors. We understand you may need a break and for that you can pause your interview anytime for 30 min (only once per session).'
    ]
}
]

interface WelcomeScreenProps {
    handleInterviewStart: () => void;
    interviewDetails: {
        applyingFor?: string;
        logo?: string;
        interviewingFor?: string;
        interviewPause?: Number;
        name?: string;
        jobDescription?: string;
    };
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
    handleInterviewStart,
    interviewDetails,
}) => {
    const [isAudioAllowed, setIsAudioAllowed] = useState(false)
    const [isVideoAllowed, setIsVideoAllowed] = useState(false)
    const [isRead, setIsRead] = useState(false)
    const disabled = isAudioAllowed && isVideoAllowed && isRead ? false : true
    const webcamRef = useRef(null);

    return (
        <Box
            sx={{
                height: "100vh",
                overflow: "auto"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    backgroundColor: "#141926",
                    height: "100vh",
                    overflow: "auto"
                }}
            >
                <Box
                    sx={{
                        width: "50vw",
                        borderRight: "1px solid #2C313B",
                    }}
                >
                    <Box
                        sx={{
                            textAlign: "center",
                            padding: "16px",
                            borderBottom: "1px solid #2C313B",
                            color: "#FFFFFF",
                            fontSize: "22px",
                            fontWeight: 600
                        }}
                    >
                        Interview Instructions
                    </Box>
                    <Box
                        sx={{
                            padding: "24px",
                            height: "47vh",
                            overflow: "auto",
                        }}
                    >
                        {/* @ts-ignore */}
                        <UnorderedList
                        >
                            {instructions?.map((item, i) => {
                                return <Box key={item?.heading} mb='15px'>
                                    <Box sx={{ fontSize: "16px", fontWeight: 600, color: '#E5E5E5', marginBottom: "7px" }}>{item?.heading}</Box>
                                    {item?.instruction?.map((inst) => {
                                        return <ListItem
                                            key={inst}
                                            sx={{
                                                fontFamily: "Inter-regular",
                                                fontSize: '14px',
                                                textAlign: "justify",
                                                color: "#E5E5E5",
                                            }}>{inst}</ListItem>
                                    })}
                                </Box>
                            })}
                        </UnorderedList>
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: "50vw",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        position={'relative'}
                        width={'100%'}
                    >
                        <Box
                            sx={{
                                fontSize: "16px",
                                fontWeight: 600,
                                color: "#E5E5E5",
                                display: 'fex',
                                gap: "10px",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "12px",
                            }}
                        >
                            <img src={companyLogo.src} alt="logo" style={{
                                height: "40px",
                                width: "40px"
                            }} />  {isVideoAllowed && isAudioAllowed ? 'Perfect! You look all set for the interview.' :
                                <span style={{ color: '#E25247' }}>Please turn on your {!isVideoAllowed && !isAudioAllowed ? 'mic & camera' : !isAudioAllowed ? 'mic' : 'camera'} to proceed </span>}
                        </Box>
                        {isVideoAllowed && isAudioAllowed && <BsDot color='green'
                            style={{ position: "absolute", right: 0, bottom: -8 }} size={80} />}
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            position: "relative",
                            overflow: "auto",
                            height: "50vh",
                        }}
                    >
                        <Box sx={{
                            padding: "20px 50px",
                            height: "45vh",
                            overflow: "hidden",
                            marginBottom: "26px",
                            width: "100%",
                        }}>
                            {isVideoAllowed ? <Webcam ref={webcamRef} style={{ width: "100%", marginTop: "-250px" }} /> :
                                <Box
                                    sx={{
                                        backgroundColor: "#000000",
                                        height: "47vh",
                                        width: "100%"
                                    }}
                                ></Box>}
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                gap: "15px",
                                justifyContent: "center",
                                marginBottom: "28px",
                                position: "absolute",
                                bottom: 5,
                                left: "50%",
                                transform: "translateX(-50%)"
                            }}
                        >
                            <Box
                                sx={{
                                    padding: "13px",
                                    backgroundColor: isAudioAllowed ? "#2C313B" : "#E25247",
                                    borderRadius: "40px",
                                    cursor: "pointer"
                                }}
                                // @ts-ignore
                                onClick={() => setIsAudioAllowed((pre: boolean) => !pre)}
                            >
                                {isAudioAllowed ? <CiMicrophoneOn color="#F3F3F3" size={32} /> :
                                    <CiMicrophoneOff color="#F3F3F3" size={32} />}
                            </Box>
                            <Box
                                sx={{
                                    padding: "13px",
                                    backgroundColor: isVideoAllowed ? "#2C313B" : "#E25247",
                                    borderRadius: "40px",
                                    cursor: "pointer"
                                }}
                                // @ts-ignore
                                onClick={() => setIsVideoAllowed((pre: boolean) => !pre)}
                            >
                                {isVideoAllowed ? <PiVideoCameraLight color="#F3F3F3" size={32} /> :
                                    <PiVideoCameraSlash color="#F3F3F3" size={32} />}
                            </Box>
                        </Box>
                        <Box sx={{
                            marginTop: "-12px",
                            display: "flex",
                            color: "#F3F3F3",
                            fontSize: "16px",
                            fontWeight: "500",
                            gap: "10px",
                            width: "100%",
                            padding: "0px 52px 20px 52px",
                            justifyContent: "space-between",
                            marginBottom: '20px'
                        }}>
                            <Box>{`Name: ${interviewDetails?.name}`}</Box>
                            <Box>{`Interviewing for: ${interviewDetails?.applyingFor}`}</Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    backgroundColor: "#0D111B",
                    minHeight: '30vh',
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0
                }}
            >
                <Box
                    sx={{ padding: "30px", display: 'flex', flexDirection: "column", alignItems: "center" }}
                >
                    <Box><img src={relaxIcon.src} alt="icon" /></Box>
                    <Box
                        sx={{
                            fontWeight: 600,
                            fontSize: "24px",
                            color: "#F3F3F3",
                            marginTop: "12px"
                        }}
                    >Relax and Get Ready for Your Interview</Box>
                    <Box
                        sx={{
                            fontSize: "16px",
                            color: "#F3F3F3",
                            marginTop: "12px",
                            marginBottom: "30px",

                        }}
                    >
                        <Checkbox size='md' isChecked={isRead} colorScheme='green' onChange={(e) => {
                            if (e.target.checked) {
                                setIsRead(true)
                            } else {
                                setIsRead(false)
                            }
                            console.log(e)
                        }} >
                            <span style={{ opacity: 0.6 }}>I have read above instructions carefully before proceeding</span>
                        </Checkbox>
                    </Box>
                    {/* @ts-ignore */}
                    <Button
                        onClick={disabled ? () => { } : handleInterviewStart}
                        _hover={{ bg: disabled ? '#B5BBC5' : "#2877EE" }}
                        _active={{ bg: disabled ? '#B5BBC5' : "#2877EE" }}
                        sx={{
                            backgroundColor: disabled ? '#B5BBC5' : "#2877EE",
                            color: '#fff',
                            padding: '15px 50px',
                            cursor: disabled ? 'no-drop' : "pointer",
                            fontSize: "16px",
                            fontWeight: 500
                        }}

                    >Start Interview</Button>
                </Box>
            </Box>
            {/* </div> */}
        </Box>
    );
};
