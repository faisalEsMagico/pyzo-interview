import { Box, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { RiArrowRightSLine } from 'react-icons/ri'
import Timer from './Timer'
import themeIcon from '../../assets/svg/themeIcon.svg'
import Logo from '../../assets/svg/Logo.png'
import PauseInterview from './PauseInterview'
import InterviewJobDescriptionPopup from './InterviewJobDescriptionPopup'
const InterviewTopBar = ({
    handleStopRecording,
    seconds,
    handleSeconds,
    minutes,
    handleMinutes,
    hours,
    handleHours,
    logo,
    interviewPause,
    jobTitle,
    jobDescription
}: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [jdOpen, setJdOpen] = useState(false)
    const [isTimerStop, setIsTimerStop] = useState<boolean>(false)

    const handlePause = () => {
        setIsOpen(true)
    }

    const handleJobListingPopup = () => {
        setJdOpen(true)
    }

    return (
        <Box
            sx={{
                padding: "24px 12px 12px 0px",
                color: "#F3F3F3",
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <InterviewJobDescriptionPopup
                isOpen={jdOpen}
                onClose={() => setJdOpen(false)}
                data={jobDescription}
            />
            <PauseInterview
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                setIsTimerStop={setIsTimerStop}
                isTimerStop={isTimerStop}
                handleStopRecording={handleStopRecording}
                interviewPause={interviewPause}
            />
            <Box sx={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ fontSize: "24px", fontWeight: 700, marginLeft: '25px' }}>
                    <img
                        src={Logo.src}
                        alt='icon'
                        style={{
                            width: '100px',
                            height: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        padding: "6px 19px",
                        backgroundColor: "#282C36",
                        borderRadius: "6px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: 'pointer'
                    }}
                    onClick={handleJobListingPopup}
                >{jobTitle} <RiArrowRightSLine size={20} /></Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    gap: "16px",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Timer
                    seconds={seconds}
                    handleSeconds={handleSeconds}
                    minutes={minutes}
                    handleMinutes={handleMinutes}
                    hours={hours}
                    handleHours={handleHours}
                    isTimerStop={isTimerStop}
                />
                {/* @ts-ignore */}
                <Button
                    size='small'
                    leftIcon={<img src={themeIcon.src} alt='icon' />}
                    background={'none'}
                    border={'none'}
                    _hover={'none'}
                >
                    {/* Theme */}
                </Button>

                <Button
                    size='small'
                    _hover="#291F29"
                    _active="#291F29"
                    color="#E25247"
                    bg={'#291F29'}
                    sx={{
                        border: '1px solid #E25247',
                        fontSize: "12px",
                        fontWeight: 700
                    }}
                    onClick={handlePause}
                    p={'9px 16px'}
                >
                    Pause / End
                </Button>

            </Box>

        </Box>
    )
}

export default InterviewTopBar