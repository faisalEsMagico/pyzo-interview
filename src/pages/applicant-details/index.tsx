import React, { useEffect, useState } from 'react'
import { deleteJob, getApplicationOverview, getJobDescription, putRequiredSkills, updateCandidateDetails } from '../../services/jobListingApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { Box, Button, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react'
import LabelValuePair from '../../components/ui-components/LabelValuePair'
import { MdOutlineRemoveRedEye, MdThumbDown, MdThumbUp, MdFileDownload } from 'react-icons/md'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { getFilePlugin, RenderDownloadProps } from '@react-pdf-viewer/get-file'
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { version } from 'pdfjs-dist';
import Layout from '../../components/Layout'
import { Backdrop, CircularProgress } from '@material-ui/core'
import JobListingPreviewPopup from '../../components/job-listing/JobListingPreviewPopup'
import ShortListingCriteriaTable1 from '../../components/interview-form/ShortListingCriteriaTable1'
import AskToArchivePopup from '../../components/job-listing/AskToArchivePopup'
import { FaArrowLeft } from 'react-icons/fa'
import { Console } from 'console'

const ApplicationDetails = () => {
    const [loading, setLoading] = useState(false)
    const [isMandatoryDetails, setIsMandatoryDetails] = useState(true)
    const [jobDescriptionDetails, setJobDescriptionDetails] = useState({})
    const [data, setData] = useState<any>({})
    const [status, setStatus] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();
    const [isUpdate, setIsUpdate] = useState(false)
    const { candidateId } = router.query;
    const [isArchiveOpen, setIsArchiveOpen] = useState(false)
    const [archiveId, setArchiveId] = useState('')
    const [archiveStatus, setArchiveStatus] = useState({
        jobListingTitle: '',
        status: false
    })
    const getFilePluginInstance = getFilePlugin();
    const { Download } = getFilePluginInstance;

    const getCandidatesDetails = async () => {
        setLoading(true)
        try {
            const resp = await getApplicationOverview(candidateId)
            console.log('resp for single user')
            setData(resp?.detail[0]);
            setStatus(resp?.detail[0]?.status)
            setLoading(false)
        } catch (e) {
            toast.error('Something went wrong please try again!')
            setLoading(false)
        }
    }

    const handleArchive = (id: string, status: boolean, title: string) => {
        setArchiveStatus({
            jobListingTitle: title,
            status: status
        })
        setIsArchiveOpen(true)
        setArchiveId(id)
    }

    const handleUnarchive = async (id: number) => {
        setLoading(true)
        try {
            const resp = await putRequiredSkills(id, { delete_flag: false })
            toast.success('Job Listing Unarchive Successfully.')
            setIsUpdate((pre: boolean) => !pre)
            console.log('unarchive', resp)
            setLoading(false)
        } catch (e) {
            console.log('error while calling unarchive api')
            toast.error('Something went wrong. please try again!')
            setLoading(false)
        }
    }



    const handleSave = async () => {
        setLoading(true)
        const req = {
            candidateid: candidateId,
            status: status
        }
        try {
            const resp = await updateCandidateDetails(req)
            toast.success('Status changed successfully')
            setLoading(false)
        } catch (e) {
            setLoading(false)
            console.log('error while calling update candidate status', e)
            toast.error('Something went wrong. please try again!')

        }
    }

    const handleDelete = async (id: number) => {
        const userId = localStorage.getItem('userId') ?? ''
        setLoading(true)
        try {
            const resp = await deleteJob(id, userId)
            toast.success('Job archived successfully!')
            router.push('/applications')
            setLoading(false)
        } catch (e) {
            console.log('error while calling delete job api:-', e)
            toast.error('Something went wrong, Please try again!')
            setLoading(false)
        }
    }


    const fetchJobDescription = async (jobId: string) => {
        try {
            const resp = await getJobDescription(jobId)
            setJobDescriptionDetails(resp)
           //console.log('prev'+ data.name);
            // setData(prevData => ({
            //     ...prevData,
            //     job_title: resp?.job_title,
            
            // }))
            // console.log('prev2'+ data.name);
        } catch (e) {
            console.log('error for job description details api:-', e)
            toast.error('Something went wrong.')
        }
    }

    useEffect(() => {
        if (data?.jobdescription_id) {
            fetchJobDescription(data?.jobdescription_id)
        }
    }, [data?.jobdescription_id, isUpdate])

    useEffect(() => {
        if (candidateId) {
            getCandidatesDetails()
        }
    }, [candidateId])



    return (
        <Layout>
            <AskToArchivePopup
                isOpen={isArchiveOpen}
                onClose={() => setIsArchiveOpen(false)}
                handleDelete={handleDelete}
                id={archiveId}
                handleUnarchive={handleUnarchive}
                archiveStatus={archiveStatus}
            />
            <JobListingPreviewPopup
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                data={jobDescriptionDetails}
                handleDelete={handleDelete}
                handleArchive={handleArchive}
            />
            {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>}

            <Box
                background={'#F6F9FC'}
                height={'100vh'}
                overflow={'auto'}
                padding={'20px'}
                marginLeft="200px"
                paddingTop='85px'
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
                    onClick={() => router.push('/applications')}
                >
                    <FaArrowLeft size={22} />
                </Button>
                <Box


                    mb='20px'
                    bg='#FFFFFF'
                >
                    <Box sx={{ display: "flex", gap: "12px" }} >
                        <Box
                            sx={{
                                padding: "16px",
                                borderRight: "1px solid #E4E4E4",
                                borderRadius: "8px",
                                width: "50%"
                            }}
                        >

                            <Box
                                bg={'#F6F9FC'}
                                p='8px'
                                borderRadius={'8px'}
                                display={'flex'}
                                justifyContent={'space-between'}
                                gap={'16px'}
                            >
                                {/* @ts-ignore */}
                                <Button
                                    width={'60%'}
                                    padding='8px 15px'
                                    bg={isMandatoryDetails ? '#003D86' : '#F6F9FC'}
                                    _hover={isMandatoryDetails ? '#003D86' : '#F6F9FC'}
                                    _active={isMandatoryDetails ? '#003D86' : '#F6F9FC'}
                                    color={isMandatoryDetails ? '#FFFFFF' : '#000000'}
                                    fontSize={'14px'}
                                    fontWeight={600}
                                    onClick={() => setIsMandatoryDetails(true)}
                                >Mandatory Interviewee Details</Button>
                                <Button
                                    width={'50%'}
                                    bg={!isMandatoryDetails ? '#003D86' : '#F6F9FC'}
                                    _hover={!isMandatoryDetails ? '#003D86' : '#F6F9FC'}
                                    _active={!isMandatoryDetails ? '#003D86' : '#F6F9FC'}
                                    color={!isMandatoryDetails ? '#FFFFFF' : '#000000'}
                                    fontSize={'14px'}
                                    fontWeight={600}
                                    onClick={() => setIsMandatoryDetails(false)}
                                >Custom Interview Details</Button>
                            </Box>

                            {isMandatoryDetails ? <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: "40px",
                                    margin: "16px 0px 80px 0px"
                                }}
                            >
                                <LabelValuePair
                                    label="Applicant Name"
                                    value={data?.name}
                                />
                                <LabelValuePair
                                    label="Phone Number"
                                    value={data?.phone}
                                />
                                <LabelValuePair
                                    label="Email"
                                    value={data?.email}
                                />
                                <LabelValuePair
                                    label="Years of Experience"
                                    value={data?.years_of_experience}
                                />
                                <LabelValuePair
                                    label="Expected salary (In LPA)"
                                    value={data?.expected_CTC ? data.expected_CTC : '--'} 
                                />

                                <LabelValuePair
                                    label="Role applying for"
                                    value={jobDescriptionDetails?.job_title}
                                />



                            </Box> : data?.custom_fields && data?.custom_fields.length > 0 ? <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: "40px",
                                    margin: "16px 0px 80px 0px",

                                }}
                            >
                                {data?.custom_fields?.map((item: any) => {
                                    return <LabelValuePair
                                        key={item?.Question}
                                        label={item?.Question}
                                        value={item?.Answer}
                                    />
                                })}
                            </Box>
                                :
                                <Box
                                    fontSize={'14px'}
                                    textAlign={'center'}
                                    my='50px'
                                >No Custom Interview Details</Box>}
                            {/* <Box
                                sx={{
                                    fontFamily: "Inter-regular",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    padding: "8px 20px",
                                    backgroundColor: "#F9F9FC"
                                }}
                            >
                                AI Reasoning For Shortlisting
                            </Box> */}
                            {/* {data?.resume_shortlisting_criteria_evaluation && data?.resume_shortlisting_criteria_evaluation.length > 0 ? <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: "12px",
                                    fontSize: "12px",
                                    marginTop: "16px",
                                    overflow: "auto",
                                    height: "260px",
                                }}
                            >
                                {data?.resume_shortlisting_criteria_evaluation?.map((item: any, index: number) => {
                                    return <Box
                                        key={item?.evaluation_reason}
                                        sx={{
                                            display: "flex",
                                            gap: "10px",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box>
                                            {item?.decision ? <MdThumbUp
                                                color='#00AF74'
                                                size={14}
                                            /> : <MdThumbDown
                                                size={14}
                                                color='#F31212'
                                            />}
                                        </Box>
                                        {item?.evaluation_reason}
                                    </Box>
                                })}
                            </Box> : <Box textAlign={'center'} width={'100%'} fontSize="12px" mt='16px'>No Data</Box>} */}
                            <Box my={'16px'} >
                                <ShortListingCriteriaTable1
                                    HeaderBg='#F9F9FC'
                                    bodyBg='#FFFFFF'
                                    borderColor='#E4E4E4'
                                    color='#000000'
                                    criteriaDecisions={data?.resume_shortlisting_criteria_evaluation ?? []}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{ width: "50%", border: '1px solid #ccc', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', /* Optional: Add border */ }}
                        >
                            <Box>
                                <Box
                                    sx={{
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        fontFamily: "Inter-regular",
                                        margin: '16px',
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}
                                >

                                    <Box>
                                        Applicants Resume
                                    </Box>
                                    <Box 
                                        display={'flex'}
                                        gap={'16px'}
                                    >
                                    <Download>
                                        {(props: RenderDownloadProps) => (
                                            <Box
                                            fontSize={'14px'}
                                            fontWeight={600}
                                            color={'white'}
                                            display={'flex'}
                                            gap='16px'
                                            alignItems={'center'}
                                            cursor={'pointer'}
                                            onClick={() => props.onClick()}
                                            padding='8px 15px'
                                            backgroundColor={'#003D86'}
                                            borderRadius={'4px'}
    
                                        >
                                            <MdFileDownload color='white' size={20} />
                                            Download Resume
                                            {/* <Download /> */}
                                        </Box>
                                        )}
                                    </Download>
                                    
                                    <Box
                                        fontSize={'14px'}
                                        fontWeight={600}
                                        color={'white'}
                                        display={'flex'}
                                        gap='16px'
                                        alignItems={'center'}
                                        cursor={'pointer'}
                                        onClick={() => setIsOpen(true)}
                                        padding='8px 15px'
                                        backgroundColor={'#003D86'}
                                        borderRadius={'4px'}

                                    >
                                        <MdOutlineRemoveRedEye color='white' size={20} />
                                        View Job Listing
                                    </Box>
                                    </Box>
                                    

                                </Box>
                                <Box
                                    sx={{
                                        // width: '100%', 
                                        height: '65vh',

                                        padding: '10px',

                                        overflow: 'hidden',
                                        border: "1px solid #E0E2E7",
                                        margin: '10px',
                                        backgroundColor: '#F9F9FC'
                                    }}
                                >
                                    {data?.cv_url && <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`}>
                                        <Viewer
                                            fileUrl={data?.cv_url}
                                        //   onLoadSuccess={onDocumentLoadSuccess}
                                        plugins={[getFilePluginInstance]}
                                        />
                                    </Worker>}
                                </Box>
                                <Box
                                    sx={{
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        fontFamily: "Inter-regular",
                                        margin: '16px',
                                        textAlign: "center",
                                        // display: "flex",
                                        padding: "9px 16px",
                                        border: '1px solid #E4E4E4',
                                        borderRadius: "8px",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <Box
                                        sx={{
                                            fontSize: "12px",
                                            fontFamily: "Inter-regular",
                                            fontWeight: 400,
                                            color: "#0B1B32",
                                            width: "300px",
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >Change Status</Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "10px", my: "6px" }}>

                                        {/* @ts-ignore */}
                                        <RadioGroup value={status} onChange={(value) => setStatus(value)} >
                                            <Box display={'flex'} gap={'10px'} flexWrap={'wrap'}>
                                                <Radio colorScheme='green' value='Resume Accepted' >
                                                    <Text fontSize={'12px'} fontWeight={400} color={'#0B1B32'} >Resume Accepted</Text>
                                                </Radio>
                                                <Radio colorScheme='red' value='Resume Rejected'>
                                                    <Text fontSize={'12px'} fontWeight={400} color={'#0B1B32'} >  Resume Rejected</Text>
                                                </Radio>
                                                <Radio colorScheme='green' value='Interview Done'>
                                                    <Text fontSize={'12px'} fontWeight={400} color={'#0B1B32'} > Interview Done</Text>
                                                </Radio>
                                                <Radio colorScheme='green' value='Interview Selected'>
                                                    <Text fontSize={'12px'} fontWeight={400} color={'#0B1B32'} >  Interview Selected</Text>
                                                </Radio>
                                                <Radio colorScheme='red' value='Interview Rejected'>
                                                    <Text fontSize={'12px'} fontWeight={400} color={'#0B1B32'} > Interview Rejected</Text>
                                                </Radio>
                                                <Radio colorScheme='green' value='Link Shared'>
                                                    <Text fontSize={'12px'} fontWeight={400} color={'#0B1B32'} >  Link Shared</Text>
                                                </Radio>
                                                <Radio colorScheme='green' value='Accepted for Position'>
                                                    <Text fontSize={'12px'} fontWeight={400} color={'#0B1B32'} >  Accepted for Position</Text>
                                                </Radio>

                                            </Box>
                                        </RadioGroup>
                                    </Box>
                                    <Box
                                        fontSize={'12px'}
                                        color='#0B1B32'
                                        fontWeight={400}
                                        textAlign={'left'}
                                        opacity={0.6}
                                    >
                                        An update to this affects the applicants progress
                                    </Box>
                                    <Box display={'flex'} justifyContent={'flex-end'} my='10px'>
                                        <Button p='7px 50px' onClick={handleSave} size='small' color='#FFFFFF' bg='#003D86' _hover='#003D86' _active={'#003D86'} >Save</Button>
                                    </Box>

                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Layout>
    )
}

export default ApplicationDetails