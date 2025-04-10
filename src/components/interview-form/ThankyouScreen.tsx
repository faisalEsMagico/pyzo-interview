import { Box, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { shortlistCandidate } from '../../services/jobListingApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import timerIcon from '../../assets/svg/timerIcon.svg'

const message = [
  'You will be redirected to the result shortly Please don’t exit this screen ',
  'Thanks for your patience!',
]

const ThankyouScreen = ({ setStep,setCriteriaDecisions }: { setStep: (arg: string) => void,setCriteriaDecisions:any }) => {
  const [progress, setProgress] = useState(0)
  const router = useRouter();
  const { jobId } = router.query;

  const handleShortlisting = async () => {
    const candidateId = localStorage.getItem("candidateId");
    try {
      const resp = await shortlistCandidate(candidateId, jobId, setProgress)
      if (resp.shortlist_status) {
        setStep('shortlisted')
      } else {
        setStep('not-shortlisted')
      }
      setCriteriaDecisions(resp?.criteria_decisions)
    } catch (e) {
      console.log('error for shortlisting candidate api:-', e)
      toast.error('something went wrong!')
    }
  }

  useEffect(() => {
    if (jobId) {
      handleShortlisting()
    }
  }, [jobId])

  return (
    <Box
      sx={{
        padding: "24px",
        paddingTop: "120px",
        backgroundColor: "#141926"
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress isIndeterminate color='#2877EE' size={240} thickness={4} >
          <CircularProgressLabel><Box>
            <Box sx={{
              display: "flex",
              fontSize: "40px",
              fontWeight: 700,
              justifyContent: "center",
              color: "#F3F3F3"
            }} > <img src={timerIcon.src} alt="icon" /> </Box>
            <Box sx={{ color: "#F3F3F3", fontWeight: 700, fontSize: '16px', display: "flex", justifyContent: "center" }}><Box sx={{ width: "70%", }}>We are screening your resume!</Box></Box>
          </Box>
          </CircularProgressLabel>

        </CircularProgress>
      </Box>
      <Box
        sx={{
          fontSize: "24px",
          fontWeight: 600,
          color: '#F3F3F3',
          textAlign: "center",
          marginTop: "28px"
        }}
      >
        We have received your application
      </Box>
      <Box
        display={"flex"}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems='center'
      >
        {message?.map((item) => {
          return <Box
            sx={{
              fontSize: "14px",
              fontFamily: "Inter-regular",
              marginTop: "24px",
              textAlign: "center",
              color: "#F3F3F3",
              opacity: 0.5,
              width: "300px"
            }}
            key={item}
          >{item}</Box>
        })}
      </Box>
    </Box>
  )
}

export default ThankyouScreen