import React, { useEffect, useState } from 'react'
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'
import styles from './index.module.css'
import pauseIcon from '../../assets/svg/pauseIcon.svg'
import { useRouter } from 'next/router'
import { postInterviewDetails } from '../../services/aiInterviewQuestion'

const OverlayOne = () => (
    <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(10px) hue-rotate(90deg)'
    />
)

const PauseInterview = ({ isOpen, onClose, setIsTimerStop, isTimerStop, handleStopRecording, interviewPause }:
    {
        isOpen: boolean,
        onClose: () => void,
        setIsTimerStop: (arg: boolean) => void,
        isTimerStop: boolean,
        handleStopRecording: (interviewEndState: string) => void,
        interviewPause: number
    }) => {
    const router = useRouter();
    const { candidate_id } = router.query;
    const [pauseCount, setPauseCount] = useState(interviewPause);
    const [time, setTime] = useState(1800);
    const [isActive, setIsActive] = useState(false); // State to track if the timer is active

    useEffect(() => {
        let timer: any;
        if (isActive && time > 0) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        }

        // Clear the interval if the timer is not active or time reaches 0
        return () => clearInterval(timer);
    }, [isActive, time]);


    const formatTime = () => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return (
            <span>
                {minutes.toString().padStart(2, '0')}
                <span style={{ fontWeight: 300 }}>min</span> :{" "}
                {seconds.toString().padStart(2, '0')}
                <span style={{ fontWeight: 300 }}>s</span>
            </span>
        );
    };

    const handleReady = async () => {
        if (isTimerStop) {
            onClose();
            // @ts-ignore
            setIsTimerStop((pre: boolean) => !pre)
            setIsActive((pre) => !pre);
            return
        }

        if (!isTimerStop) {

            const request = {
                candidate_id: candidate_id,
                interview_pause: pauseCount + 1,
            }
            const resp = await postInterviewDetails(request)
            setPauseCount((pre) => pre + 1)
        }
        // @ts-ignore
        setIsTimerStop((pre: boolean) => !pre)
        setIsActive((pre) => !pre);
    }

    const handleEndTest = () => {
        handleStopRecording("Manual End")
        onClose();

    }

    const handleClose = () => {
        // @ts-ignore
        setIsTimerStop(false)
        setIsActive(false)
    }

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size='xl'>
            {OverlayOne()}
            {/* @ts-ignore */}
            <ModalContent>
                <ModalCloseButton color={'#F3F3F3'} onClick={handleClose} />
                <ModalBody padding={30} sx={{ backgroundColor: "#2C313B" }} >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <img src={pauseIcon.src} alt="icon" />
                    </Box>
                    <Box
                        sx={{
                            fontSize: "24px",
                            fontWeight: 600,
                            color: "#F3F3F3",
                            textAlign: "center",
                            marginTop: "25px"
                        }}
                    >
                        {isTimerStop ? 'Your Interview is paused' : 'What would you like to do?'}
                    </Box>
                    <Box
                        sx={{
                            fontSize: "16px",
                            fontWeight: 400,
                            color: "#F3F3F3",
                            textAlign: "center",
                            marginTop: "14px",
                            opacity: 0.6

                        }}
                    >
                        {isTimerStop ? 'Take a moment to sit back and relax' : 'You can either pause and come back within 30 mins or end your interview'}
                    </Box>
                    <Box
                        sx={{
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#F3F3F3",
                            textAlign: "center",
                            marginTop: "14px",
                            opacity: isTimerStop ? 1 : 0.4
                        }}
                    >
                        {formatTime()}
                    </Box>
                    <div className={styles.buttonContainer} style={{ marginTop: "40px" }}>
                        <Button
                            onClick={handleEndTest}
                            _hover={{ bg: '#282C36' }}
                            _active={{ bg: '#282C36' }}
                            color={'#F3F3F3'}
                            bg={'#282C36'}
                            fontSize={'16px'}
                            fontWeight={500}
                            px={'30px'}
                        >
                            Submit & End
                        </Button>
                        <Button
                            onClick={handleReady}
                            _hover={{ bg: '#287EEE' }}
                            _active={{ bg: '#287EEE' }}
                            color={'#F3F3F3'}
                            bg={'#287EEE'}
                            variant='solid'
                            fontSize={'16px'}
                            fontWeight={500}
                            px={'27px'}
                        >
                            {isTimerStop ? 'Continue Interview' : 'Pause & Save'}
                        </Button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default PauseInterview