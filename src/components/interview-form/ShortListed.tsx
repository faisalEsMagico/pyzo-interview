import { Box, Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { generateInterviewLink } from '../../services/jobListingApi'
import { useRouter } from 'next/router'
import qualifyIcon from '../../assets/images/qualifyIcon.gif'
import { useCredits } from "../../context/CreditsContext"

const message = [
    "You have been shortlisted for the next step, it’s an AI Interview!!",
    "You can either take it now or later, the link is shared to your mail"
]

const ShortListed = ({ criteriaDecisions }: any) => {
    const [interviewLink, setInterviewLink] = useState('')
    const router = useRouter();
    const { jobId } = router.query;
    const { recruiterId } = router.query;
    const [insufficientCredits, setInsufficientCredits] = useState(false);
    const {handleGetCredits} = useCredits();


    const handleInterview = () => {
        if (interviewLink) {
            window.open(interviewLink, '_blank');
        }
    }

    const handleGenerateInterviewLink = async () => {
        const candidateId = localStorage.getItem("candidateId");
        try {
            const resp = await generateInterviewLink({ jobid: jobId, candidate_id: candidateId, recruiter_id: recruiterId})
            setInterviewLink(resp?.interview_link)
            if(resp?.interview_link) {
                handleGetCredits();
            }
        } catch (e) {
            if(e?.response?.data?.message === "Subscribe Plan, Insufficient Credits!! ") {
                setInsufficientCredits(true);
                return
            }
            console.log('error for generating interview link api:-', e)
            toast.error('something went wrong!')
        }
    }

    useEffect(() => {
        if (jobId) {

            handleGenerateInterviewLink()
        }
    }, [jobId])

    return (
        <Box
            sx={{
                fontFamily: "Inter-regular",
            }}
        >
            <Box>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: '120px' }}>
                    <img src={qualifyIcon.src} alt="icon" style={{
                        width: "80px",
                        height: "80px"
                    }} />
                </Box>
                <Box
                    sx={{
                        fontWeight: 600,
                        fontSize: '24px',
                        textAlign: "center",
                        color: '#F3F3F3',
                        marginTop: "28px"
                    }}
                >
                    Congratulations !!!
                </Box>
                <Box
                    sx={{
                        paddingBottom: "24px",
                        marginTop: "18px",
                        color: '#F3F3F3',
                        opacity: 0.6
                    }}
                >
                    {message.map((item) => {
                        return <Box
                            sx={{
                                fontSize: "14px",
                                fontFamily: "Inter-regular",
                                textAlign: "center",
                                lineHeight: "24px"
                            }}
                            key={item}
                        >{item}</Box>
                    })}
                </Box>
                {!insufficientCredits && <><Box sx={{ marginTop: "40px", marginBottom: "16px", textAlign: "center" }}>
                    {/* @ts-ignore */}
                    <Button
                        bg='#2877EE'
                        _hover='#2877EE'
                        _active='#2877EE'
                        color='#FFFFFF'
                        fontSize={'16px'}
                        onClick={handleInterview}
                        width='273px'
                    >
                        Take AI Interview
                    </Button>
                </Box>
                <Box display={'flex'} justifyContent={'center'} mb='20px'>
                    <Box sx={{ fontSize: "12px", textAlign: "center", color: '#7E8794', width: "400px" }}>
                        AI interview link expires in 48 hours, you need to re-apply to get another interview scheduled post expiry
                    </Box>
                </Box></>}
            </Box>
        </Box>
    )
}

export default ShortListed