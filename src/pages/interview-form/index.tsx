import { Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import UserForm from '../../components/interview-form/UserForm'
import ThankyouScreen from '../../components/interview-form/ThankyouScreen'
import NotShortListed from '../../components/interview-form/NotShortListed'
import ShortListed from '../../components/interview-form/ShortListed'

const InterviewForm = () => {
    const [step, setStep] = useState('form')
    const [criteriaDecisions, setCriteriaDecisions] = useState<any>([]);
    return (
        <div style={{ backgroundColor: "#141926", height: "100vh" }}>
            <Box
                sx={{
                    display: "flex",
                    backgroundColor: "#141926",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    borderBottom: "1px solid #2C313B",
                    zIndex: 10
                }}
            >
                <Box
                    sx={{
                        color: "#F3F3F3",
                        padding: "16px 40px",
                        fontSize: "24px",
                        fontWeight: 600,
                    }}
                >
                    PYZO
                </Box>
            </Box>
            <Box
                sx={{
                    marginX: '24px',
                    borderTop: "4px solid #1680FF",
                    paddingRight: "5px",
                    height:"100vh",
                    overflow:'auto'
                }}>
                {step === 'form' && <UserForm setStep={setStep} />}
                {step === 'form-submitted' &&
                    <ThankyouScreen
                        setStep={setStep}
                        setCriteriaDecisions={setCriteriaDecisions}
                    />
                }
                {step === 'not-shortlisted' && <NotShortListed criteriaDecisions={criteriaDecisions} />}
                {step === 'shortlisted' && <ShortListed criteriaDecisions={criteriaDecisions} />}
            </Box>
        </div>
    )
}

export default InterviewForm