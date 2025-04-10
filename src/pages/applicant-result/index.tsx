import { Box, Button, CircularProgress, CircularProgressLabel, Tooltip } from '@chakra-ui/react'
//import { Box, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { IoIosCalendar } from 'react-icons/io'
import { formatDate, formatTime } from '../../utils/formatTimeAndDate'
import { GoClockFill } from 'react-icons/go'
import Recording from '../../components/interviewResult/Recording'
import HorizontalLabelValuePair from '../../components/ui-components/HorizontalLabelValuePair'
import InterviewResultNav from '../../components/interviewResult/InterviewResultNav'
import dummyProfile from '../../assets/images/userProfile.png'
import { getInterviewResultForSingleCandidate, getApplicationOverview} from '../../services/jobListingApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import Interview from '../../components/interviewResult/Interview'
import Layout from '../../components/Layout'
import Overview from '../../components/interviewResult/Overview'
import QAndASummary from '../../components/interviewResult/QAndASummary'
import { Backdrop } from '@material-ui/core'
import FeedbackPdf from '../../components/interviewResult/pdf/FeedbackPdf'
// @ts-ignore
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { FaArrowLeft } from 'react-icons/fa';
import { interviewFeedback } from "../../services/aiInterviewQuestion"
import {feedbackHeaderDataInit, feedbackShowCircleDataInit, feedbackOverviewDataInit} from "../../utils/feedbackFormInitializations"

const ApplicantResult = () => {
    const [activeNav, setActiveNav] = useState('overview')
    const [data, setData] = useState<any>({})
    const [interviewQuestions, setInterviewQuestion] = useState([])
    const [skillOptions, setSkillOptions] = useState([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { candidateId, feedbackFlag } = router.query;
    const [isHovered, setIsHovered] = useState(false);
    const [isOverallScoreHovered, setIsOverallScoreHovered] = useState(false);
    const [isSoftSkillHovered, setIsSoftSkillHovered] = useState(false);
    
    const [isSoftSkillScoreHovered, setIsSoftSkillScoreHovered] = useState(false);


    const handleDownload = async () => {
        setLoading(true);
        // try {
        //     const blob = await pdf(
        //         <FeedbackPdf data={data}  candidateData={candidateData} />
        //     ).toBlob();
        //     saveAs(
        //         blob,
        //         `${data?.name ?? "assessment-sheet"}`
        //     );
        //     setLoading(false);
        // } 
        try {
    if (candidateData) {  
        const blob = await pdf(
            <FeedbackPdf 
                data={data} 
                candidateData={candidateData}
                feedbackHeaderData={feedbackHeaderDataInit}
                feedbackShowCircleData={feedbackShowCircleDataInit}
                feedbackOverviewData={feedbackOverviewDataInit}
            />
        ).toBlob();
        
        saveAs(
            blob,
            `${data?.name ?? "assessment-sheet"}`
        );
    } else {
        console.error("candidateData is missing");
    }
    
    setLoading(false);
}
        catch (error) {
            if (error) {
                // to show pdf download error modal
                console.log(error, "Download As PDF")
                toast.error("Something went wrong please try again!");
            }
        }
    };

    const handleFeedback = async () => {
        setLoading(true)
        try {
            console.log(data?.jobdescription__id)
            const recruiter_id = localStorage.getItem('userId');
            const resp = await interviewFeedback(data?.jobdescription__id, candidateId, recruiter_id)
            setLoading(false)
            router.push(`applicant-result?candidateId=${candidateId}&feedbackFlag=true`)
        } catch (e) {
            // @ts-ignore
            if (e?.response?.data === 'No Interview Session Found') {
                setLoading(false)
                return
            }
            if(e?.response?.data?.message === "Subscribe Plan, Insufficient Credits!! ") {
                toast.error('Insufficient Credits!. Please purchase credits.')
                setLoading(false)
                return
            }
            console.log('error in feedback api:-', e);
            toast.error('Something went wrong!')
            setLoading(false)
        }
    }


    const [candidateData, setCandidateData] = useState({})
    //const [loading, setLoading] = useState(true);
    const jobdescriptionexperince = async (id: any) => {
        // setLoading(true)

        // const resp1 = await getJobDescription(id);
        // console.log('RESP1', resp1.years_of_experience);
        
        // setCandidateData(resp1);
        // console.log('candidateData--', candidateData);
        // setLoading(false)
        // setIsOpen(true)
        try {
            setLoading(true); // Start loading
            const resp = await getApplicationOverview(id);
            console.log('RESP1', resp?.detail[0]?.years_of_experience);
            

            setCandidateData(resp?.detail[0]); 
            console.log('CanidateData123', candidateData);
        } catch (error) {
            console.error('Error fetching job description:', error);
        } finally {
            setLoading(false); 
        }


    }

    useEffect(() => {
        if (data.id) {
            console.log('data.id---'+data?.id);
            jobdescriptionexperince(data.id);  
        }
    }, [data.id]);


    const handleInterviewDetails = async () => {
        setLoading(true)
        try {
            const resp = await getInterviewResultForSingleCandidate(candidateId)
            setData(resp?.detail)
            const options = resp?.detail?.feedback_skill_evaluation?.map((item: any) => {
                return {
                    label: item?.skill,
                    value: item?.skill
                }
            })
            setInterviewQuestion(resp?.detail?.interviews)
            setSkillOptions(options)
            setLoading(false)

        } catch (e) {
            console.log('error for get interview result for single candidate api', e)
            toast.error('Something went wrong!')
            setLoading(false)
        }
    }

    console.log('interviewQuestions', interviewQuestions)

    useEffect(() => {
        if (candidateId) {
            handleInterviewDetails()
        }

    }, [candidateId])

    return (
        <Layout>
            <Box>
                {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
                    <CircularProgress color="inherit" />
                </Backdrop>}
                <Box
                    padding="20px 20px 90px 20px"
                    backgroundColor="#F9F9FC"
                    marginLeft={'200px'}
                    height={'100vh'}
                    overflow={'auto'}
                    marginTop={'65px'}
                >
                    {/* @ts-ignore */}
                    <Button
                        size='small'
                        bg='#FFFFFF'
                        _hover={'#FFFFFF'}
                        _active={'#FFFFFF'}
                        color='#003D86'
                        border={'1px solid #003D86'}
                        p={'7px 20px'}
                        mb='20px'
                        onClick={() => router.push('/interview-results')}
                    >
                        <FaArrowLeft size={22} />
                    </Button>
                    <Box
                        sx={{

                            borderRadius: "8px",
                            padding: "16px",
                            backgroundColor: "#FFFFFF"
                        }}
                    // height={"80vh"}

                    >

                        <Box sx={{ marginTop: "24px", display: 'flex', justifyContent: "space-between", alignItems: "center", }}>
                            <Box sx={{ display: 'flex', alignItems: "center", flexWrap: "nowrap" }}>
                                <Box>
                                    <img src={dummyProfile.src} alt="profileImg" style={{ width: '100px', height: '100px' }} />
                                </Box>
                                <Box sx={{ marginLeft: "20px", display: 'flex', gap: "24px", fontSize: "12px", flexDirection: "row" }}>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'column'}
                                        alignItems={'flex-start'}
                                        gap={'16px'}
                                    >
                                        <HorizontalLabelValuePair label='Applicant Name' value={data?.name} />
                                        <HorizontalLabelValuePair label='Email address' value={data?.email} />
                                    </Box>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'column'}
                                        alignItems={'flex-start'}
                                        gap={'16px'}
                                    >
                                        <HorizontalLabelValuePair label='Mobile Number' value={data?.phone} />
                                        <HorizontalLabelValuePair label='Role Applying For' value={data?.jobdescription__job_title} />
                                    </Box>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'column'}
                                        alignItems={'flex-start'}
                                        gap={'16px'}
                                    >
                                        <HorizontalLabelValuePair label='Years of Experience' value={candidateData?.years_of_experience} />
                                        <HorizontalLabelValuePair label='Expected salary (In LPA)' value={candidateData?.expected_CTC} />
                                    </Box>
                                </Box>
                            </Box>


                            {/* circularprogress label */}
                            <Box
                                display={'flex'}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                                flexWrap="wrap"
                                marginLeft={"10px"}
                            >
                                <Box
                                    p={'34px 20px'}
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}
                                    flexWrap="wrap"
                                >
                                    <Box display="flex" gap="10px">
                                        {/* Overall Score Circular Progress */}
                                        <Box
                                            position="relative"
                                            onMouseEnter={() => setIsOverallScoreHovered(true)}
                                            onMouseLeave={() => setIsOverallScoreHovered(false)}
                                        >
                                            <CircularProgress
                                                value={parseInt(data?.feedback_overallscore) * 10}
                                                size="112px"
                                                thickness="4px"
                                                
                                                sx={{
                                                    '& .chakra-progress__track': {
                                                        backgroundColor: '#7D2DFF',
                                                        
                                                    },
                                                }}
                                            >
                                                <CircularProgressLabel>
                                                    <Box>
                                                        {/* Score Display */}
                                                        <Box
                                                            sx={{
                                                                color: '#1D1F2C',
                                                                fontWeight: 700,
                                                                fontSize: '20px',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <Box sx={{ width: '70%' }}>
                                                                {data?.feedback_overallscore ? (
                                                                    <span>
                                                                        {data.feedback_overallscore}/<span style={{ fontSize: '16px' }}>10</span>
                                                                    </span>
                                                                ) : (
                                                                    '--'
                                                                )}
                                                            </Box>
                                                        </Box>

                                                        {/* Label Display */}
                                                        <Box
                                                            sx={{
                                                                color: '#1D1F2C',
                                                                fontWeight: 700,
                                                                fontSize: '11px',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                mx: 2
                                                            }}
                                                        >
                                                            <Box sx={{ width: '70%' }}>Overall Score</Box>
                                                        </Box>
                                                    </Box>
                                                </CircularProgressLabel>
                                            </CircularProgress>

                                            {/* Hover Effect for Overall Score */}
                                            {isOverallScoreHovered && (
                                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                                    {/* Tooltip Box */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '45px',
                                                        // left: '60%',               
                                                        transform: 'translateX(-70%)',
                                                        padding: '8px',
                                                        backgroundColor: '#E4E4F0',
                                                        borderRadius: '8px',
                                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                                        fontSize: '13px',
                                                        color: '#000000',
                                                        lineHeight: '1.2',
                                                        textAlign: 'center',
                                                        width: '220px',
                                                        zIndex: '100',
                                                    }}>
                                                        This score is a measure of the skills that have been tested
                                                    </div>

                                                    {/* Triangle (Arrow) above the tooltip box */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '35px',
                                                        right: '190%',
                                                        transform: 'translateX(-190%)',
                                                        marginBottom: '90px',
                                                        width: '0',
                                                        height: '0',
                                                        borderLeft: '10px solid transparent',
                                                        borderRight: '10px solid transparent',
                                                        borderBottom: '10px solid #E4E4F0',
                                                        zIndex: '100',
                                                    }} />
                                                </div>

                                            )}
                                        </Box>

                                        {/* Soft Skill Score Circular Progress */}
                                        <Box
                                            position="relative"
                                            onMouseEnter={() => setIsSoftSkillHovered(true)}
                                            onMouseLeave={() => setIsSoftSkillHovered(false)}
                                        >
                                            <CircularProgress
                                                value={parseInt(data?.feedback_overallscore) * 10}
                                                size="112px"
                                                thickness="4px"
                                                 color="#7D2DFF" 
                                                sx={{
                                                    '& .chakra-progress__track': {
                                                        backgroundColor: '#2D8DFF',
                                                    },
                                                }}
                                            >
                                                <CircularProgressLabel>
                                                    <Box>
                                                        {/* Score Display */}
                                                        <Box
                                                            sx={{
                                                                color: '#1D1F2C',

                                                                fontWeight: 700,
                                                                fontSize: '20px',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <Box sx={{ width: '70%' }}>
    {data?.sentimentscore != null ? (
        <span>
            {feedbackFlag === "false" ? "--" : <>{data.sentimentscore}/<span style={{ fontSize: '16px' }}>10</span></>}
        </span>
    ) : (
        '--'
    )}
</Box>
                                                        </Box>

                                                        {/* Label Display */}
                                                        <Box
                                                            sx={{
                                                                color: '#1D1F2C',
                                                                fontWeight: 700,
                                                                fontSize: '11px',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                mx: 2
                                                            }}
                                                        >
                                                            <Box sx={{ width: '70%' }}>Soft Skill Score</Box>
                                                        </Box>
                                                    </Box>
                                                </CircularProgressLabel>
                                            </CircularProgress>

                                            {/* Hover Effect for Soft Skill */}
                                            {isSoftSkillHovered && (
                                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                                    {/* Tooltip Box */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '45px',                // << Reduced to move the tooltip closer to the CircularProgress
                                                        left: '20%',                // << Center horizontally
                                                        transform: 'translateX(-80%)',
                                                        padding: '8px',
                                                        backgroundColor: '#E4E4F0',
                                                        borderRadius: '8px',
                                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                                        fontSize: '13px',
                                                        color: '#000000',
                                                        lineHeight: '1.2',
                                                        textAlign: 'center',
                                                        width: '220px',
                                                        zIndex: '100',
                                                    }}>
                                                        This score is a measure of the soft skills of the candidate
                                                    </div>

                                                    {/* Triangle (Arrow) above the tooltip box */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '35px',               // << Reduced to align the arrow closer to the CircularProgress
                                                        left: '20%',               // << Center the arrow horizontally
                                                        transform: 'translateX(-320%)',
                                                        width: '0',
                                                        height: '0',
                                                        borderLeft: '10px solid transparent',
                                                        borderRight: '10px solid transparent',
                                                        borderBottom: '10px solid #E4E4F0',
                                                        zIndex: '100',
                                                    }} />
                                                </div>
                                            )}
                                        </Box>

                                    </Box>
                                </Box>
                            </Box>

                            <Box
                                textAlign={'right'}
                            >
                                {candidateData?.interview_end_reason && <Box sx={{padding: "10px", textAlign: "start"}}><HorizontalLabelValuePair label='Interview End Reason' value={candidateData?.interview_end_reason} /></Box>}
                                <Box
                                    sx={{
                                        display: "flex",
                                        padding: "8px",
                                        border: "1px solid #B9BECB",
                                        borderRadius: "4px",
                                        gap: "15px",
                                        flexWrap: "nowrap",
                                        marginLeft: "15px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: "8px",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "12px",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        <IoIosCalendar size={20} color={'#A3A9B6'} />
                                        {/* {formatDate(data?.created)} */}
                                        {formatDate(interviewQuestions[interviewQuestions.length - 1]?.created)}
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: "8px",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "12px",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        <GoClockFill size={20} color={'#A3A9B6'} />
                                        {/* {formatTime(data?.created)} */}
                                        {formatTime(interviewQuestions[interviewQuestions.length - 1]?.created)}
                                    </Box>
                                </Box>
                                {/* @ts-ignore */}
                                {feedbackFlag === "true" && <Button
                                    size='small'
                                    paddingY={'7px'}
                                    paddingX={'60px'}
                                    mt={'16px'}
                                    color={'#FFFFFF'}
                                    bg='#003D86'
                                    _hover={'#003D89'}
                                    _active={'#003D86'}
                                    onClick={handleDownload}
                                    fontSize={'14px'}
                                    fontWeight={500}
                                >Download As PDF</Button>}
                                {feedbackFlag === "false" && <Button
                                    size='small'
                                    paddingY={'7px'}
                                    paddingX={'54px'}
                                    mt={'16px'}
                                    color={'#FFFFFF'}
                                    bg='#003D86'
                                    _hover={'#003D89'}
                                    _active={'#003D86'}
                                    onClick={handleFeedback}
                                    fontSize={'14px'}
                                    fontWeight={500}
                                >Generate Feedback</Button>}
                            </Box>

                        </Box>
                        {(feedbackFlag === "true") ? <><InterviewResultNav
                            activeNav={activeNav}
                            setActiveNav={setActiveNav}
                            skillOptions={skillOptions}
                            handleInterviewQuestion={setInterviewQuestion}
                            allData={data?.interviews}
                        />
                        {activeNav === 'overview' && <Overview data={data} />}
                        {activeNav === 'QA' && <QAndASummary data={interviewQuestions} />}
                        {activeNav === 'recording' && <Box width={'100%'} border='1px solid red'></Box>
                            // <Recording />
                        }</> : <Box
                            sx={{
                                fontSize: "12px",
                                fontStyle: "italic"
                            }}
                        >Note: Unable to generate feedback due to insufficient credits. Please purchase credits to enable feedback generation.</Box> }
                    </Box>
                </Box>
            </Box>
        </Layout>
    )
}

export default ApplicantResult