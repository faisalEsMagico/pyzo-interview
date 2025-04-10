import React, { useEffect } from 'react'
import { WelcomeScreen } from '../welcomeScreen/WelcomeScreen'

interface StartInterviewProps {
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

const StartInterviewPage: React.FC<StartInterviewProps> = ({
  handleInterviewStart,
  interviewDetails,
}) => {
  useEffect(() => {
    const messages = localStorage.getItem("conversation")
    if (!messages) {
      localStorage.setItem("conversation", "[]")
    }
  }, []);
  return (
    <WelcomeScreen
      handleInterviewStart={handleInterviewStart}
      interviewDetails={interviewDetails}
    />
  )
}

export default StartInterviewPage