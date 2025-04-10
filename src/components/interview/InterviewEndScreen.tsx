import { Box, Button } from '@chakra-ui/react'
import React from 'react'
import interviewIcon from '../../assets/images/interviewCompleteGif.gif'
const InterviewEndScreen = ({ handleStopRecording }:
    { handleStopRecording: (interviewEndState: string) => void }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: 'center',
                height: "44%",
                overflow:"auto"
            }}
        >
            <Box sx={{
                height: "50px",
                width: "50px",
                overflow: "hidden",
            }}>
                <img src={interviewIcon.src} alt="icon" />
            </Box>
            <Box
                sx={{
                    color: '#E5E5E5',
                    fontSize: "24px",
                    fontWeight: 600,
                    marginTop: '24px'
                }}
            >
                Congratulations!!</Box>
            <Box
                sx={{
                    color: '#E5E5E5',
                    fontSize: "16px",
                    fontWeight: 600,
                    marginTop: '24px'
                }}
            >
                Your interview is complete. I hope you had fun, because I sure did.</Box>
            {/* @ts-ignore */}
            <Button
                color="#F3F3F3"
                bg='#6DAA39'
                _hover='#6DAA39'
                _active='#6DAA39'
                fontSize={'16px'}
                fontWeight={600}
                mt='50px'
                borderRadius='40px'
                padding='0px 40px'
                onClick={() => handleStopRecording("Interview Completed")}
            >
                End Interview</Button>
        </Box >
    )
}

export default InterviewEndScreen