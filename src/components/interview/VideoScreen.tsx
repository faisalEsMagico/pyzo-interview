import { Box } from '@chakra-ui/react'
import React, { useRef } from 'react'
import Webcam from "react-webcam";
import InterviewLabelValue from './InterviewLabelValue';
import { BsSoundwave } from 'react-icons/bs';
import interveiwEsmagicoLogo from '../../assets/images/interviewEsmagicoLogo.png'

const VideoScreen = ({ companyLogo, interviewDetails }:
    { companyLogo: any, interviewDetails: any }) => {
    const webcamRef = useRef(null);
    return (
        <Box
            sx={{

                display: "flex",
                gap: "12px",
                margin: "8px 12px",
                height: "34%",
                flexGrow: "1"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: "16px",
                    width: "50%",
                    backgroundColor: "#0D111B",
                    borderRadius: "12px",
                    padding: "10px",
                    alignItems: "center"
                }}
            >
                <Box sx={{
                    width: "350px",
                    height: "100%",
                    overflow: "hidden",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <Webcam ref={webcamRef} style={{marginTop: "-10px", borderRadius: "6px"}}/>
                </Box>
                <Box>
                    <InterviewLabelValue
                        label='Name'
                        value={interviewDetails?.name ?? ''} />
                    <InterviewLabelValue
                        label='Applying for'
                        value={interviewDetails?.applyingFor ?? ''}
                    />
                    <InterviewLabelValue
                        label='Interviewing for'
                        value={interviewDetails?.interviewingFor ?? ''}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    width: "50%",
                    backgroundColor: "#0D111B",
                    borderRadius: "12px",
                    padding: "16px",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <BsSoundwave
                    color="#F3F3F3"
                    size={20}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px'
                    }}
                />
                <img src={companyLogo.src} alt="logo" />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px'
                    }}
                >
                    <Box
                        sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#F3F3F3",
                            textAlign: "right"
                        }}
                    >AI
                    </Box>
                    <Box
                        sx={{
                            fontSize: "8px",
                            fontWeight: 600,
                            color: "#F3F3F3",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "5px"
                        }}
                    >
                        Powered By
                        <img src={interveiwEsmagicoLogo.src} alt='logo' />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default VideoScreen