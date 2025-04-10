import React, { useState, useEffect, useRef } from 'react'
import { getJobDescription } from '../../services/jobListingApi'

import {
    Box,
    Button,
    CircularProgress,
    CircularProgressLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
} from '@chakra-ui/react'
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { IoIosCalendar } from 'react-icons/io';
import { GoClockFill } from 'react-icons/go';
import HorizontalLabelValuePair from '../ui-components/HorizontalLabelValuePair';
import dummyProfile from '../../assets/images/userProfile.png'
import { formatDate, formatTime } from '../../utils/formatTimeAndDate'
import InputField from '../ui-components/InputField';
import { pdf } from '@react-pdf/renderer';
import FeedbackPdf from './pdf/FeedbackPdf';
import { sendFeedbackAsMail, updateCandidateDetails, getApplicationOverview } from '../../services/jobListingApi';
import toast from 'react-hot-toast';
import CustomCheckbox from '../ui-components/CustomeCheckbox';
import previewIcon from '../../assets/svg/PreviewIcon.svg';
import editIcon from '../../assets/svg/editIcon.svg';
import { feedbackHeaderDataInit, feedbackShowCircleDataInit, feedbackOverviewDataInit } from "../../utils/feedbackFormInitializations"

const InterviewResultPopup = ({
    isOpen,
    onClose,
    data,
    handleInterviewDetails,
    feedbackMailType,
    setFeedbackMailType }:
    { isOpen: boolean, onClose: () => void, data: any, handleInterviewDetails: (arg: string) => void, feedbackMailType: string, setFeedbackMailType: (arg: string) => void }) => {
    const [loading, setLoading] = useState(false)
    const [interviewerFeedback, setInterviewerFeedback] = useState(data?.email_feedback ?? '')
    const [jobDescriptionDetails, setJobDescriptionDetails] = useState({})
    const [setData] = useState<any>({})
    const [candidateData, setCandidateData] = useState({})
    console.log('pdf data', data);
    const [feedbackHeaderData, setFeedbackHeaderData] = useState(feedbackHeaderDataInit);
    const [feedbackShowCircleData, setFeedbackShowCircleData] = useState(feedbackShowCircleDataInit);
    const [feedbackOverviewData, setFeedbackOverviewData] = useState(feedbackOverviewDataInit);
    const [editFeedbackEmailDraft, setEditFeedackEmailDraft] = useState(false);
    const emailDraftRef = useRef(null);

    const [feedBackMailText, setFeedBackMailText] = useState("");

    const generatePdfBlob = async () => {
        // Generate the PDF blob from the document

        const blob = await pdf(<FeedbackPdf data={data} feedbackHeaderData={feedbackHeaderData} feedbackShowCircleData={feedbackShowCircleData} candidateData={candidateData} feedbackOverviewData={feedbackOverviewData} />).toBlob();
        return blob;
    };

    const blobToFile = (blob: Blob, filename: string) => {
        // Create a File object from the Blob
        return new File([blob], filename, { type: 'application/pdf' });
    };

    const handleInitializeFeedackMailDraft = (jobTitle) => {
        const acceptanceMailCopy = `Dear Candidate,

Congratulations! We are pleased to inform you that you have successfully cleared the AI interview for the role of **${jobTitle}**

Please find attached the feedback PDF with further details.

We look forward to having you on board!

Best regards,`;

        const rejectionMailCopy = `Dear Candidate,

Thank you for taking the AI interview for the role of **${jobTitle}** 

After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. Please find attached the feedback PDF for your reference.

We appreciate your time and interest, and we wish you all the best in your future endeavors.

Best regards,`

        setFeedBackMailText((prev) => feedbackMailType === "Acceptance" ? acceptanceMailCopy : rejectionMailCopy);
    }

    const handleEditEmailDraft = () => {
        setEditFeedackEmailDraft((prev) => true);
    }

    const handleFeedbackHeaderData = (id: Number, isChecked: boolean) => {
        const updatedData = feedbackHeaderData.map((field) => field.id === id ? { ...field, isChecked: isChecked } : field);
        setFeedbackHeaderData((prev) => updatedData)
    }

    const handleFeedackCircleShowData = (id: Number, isChecked: boolean) => {
        const updatedData = feedbackShowCircleData.map((field) => field.id === id ? { ...field, isChecked: isChecked } : field);

        setFeedbackShowCircleData((prev) => updatedData);
    }

    const handleFeedbackOverviewData = (id: Number, flag: boolean) => {
        const updatedData = feedbackOverviewData.map((field) => field.id === id ? { ...field, flag: flag } : field);

        setFeedbackOverviewData((prev) => updatedData);
    }

    const handleFeedbackPdfPreview = async () => {
        const blob = await generatePdfBlob();
        if (blob) {
            const pdfUrl = URL.createObjectURL(blob);
            window.open(pdfUrl, '_blank');
        }
    }

    const handleSendFeedback = async (key: string) => {
        if (key === '') {
            return;
        }

        const pdfBlob = await generatePdfBlob();
        // Convert the Blob to a File object
        const pdfFile = blobToFile(pdfBlob, 'interview_feedback.pdf');

        // Create FormData to include the file
        const formData = new FormData();
        formData.append('pdf', pdfFile);
        formData.append('candidateid', data?.id);
        formData.append('body', feedBackMailText);
        try {
            setLoading(true)
            const resp = await sendFeedbackAsMail(formData, key)
            toast.success(resp?.detail)
            console.log(resp)
            setLoading(false)
        } catch (e) {
            setLoading(false)
            console.log('error while calling email feedback', e);
            toast.error('Something went wrong. Please try again!')
        }


    }

    const handleSave = async () => {
        if (!interviewerFeedback) {
            toast.error('Please enter additional comment first!')
            return
        }
        setLoading(true)
        const req = {
            candidateid: data?.id,
            feedback: interviewerFeedback
        }
        try {
            const resp = await updateCandidateDetails(req)
            toast.success('Status changed successfully')
            await handleInterviewDetails(data?.id)
            setLoading(false)
        } catch (e) {
            setLoading(false)
            console.log('error while calling update candidate status', e)
            toast.error('Something went wrong. please try again!')

        }
    }

    const fetchJobDescription = async (id: string) => {
        try {
            const resp1 = await getApplicationOverview(id)
            setJobDescriptionDetails(resp1?.detail[0])
            setCandidateData(resp1?.detail[0]);
            //console.log('prevr11esp?.detail?.years_of_experience'+ resp1?.detail[0]?.years_of_experience);
            // console.log('preesp?.detail?.years_of_experience'+ data?.years_of_experience);
            setData(prevData => ({
                ...prevData,
                years_of_experience: resp1?.detail[0]?.years_of_experience,

            }))
            console.log('preesp?.detail?.years_of_experience' + data?.years_of_experience);
        } catch (e) {
            console.log('error for job description details api:-', e)
            //toast.error('Something went wrong.')
        }
    }

    useEffect(() => {
        if (data?.jobdescription__id) {
            console.log('job description' + data?.id);
            fetchJobDescription(data?.id)
            handleInitializeFeedackMailDraft(data?.jobdescription__job_title);
        }
    }, [data?.id])

    useEffect(() => {
        if (data?.jobdescription__job_title) {
            handleInitializeFeedackMailDraft(data?.jobdescription__job_title);
        }
    }, [feedbackMailType])

    useEffect(() => {
        if (emailDraftRef.current) {
            emailDraftRef.current.focus();
            emailDraftRef.current.setSelectionRange(feedBackMailText.length, feedBackMailText.length)
        }
    }, [editFeedbackEmailDraft])

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size='6xl'>

            {OverlayOne()}
            {/* @ts-ignore */}
            <ModalContent>
                <ModalHeader m='0' p='0' >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingRight: '50px'
                        }}>
                        <Box

                            sx={{
                                fontFamily: "Inter-regular",
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#000000",
                                paddingBottom: "20px",
                                padding: "20px",
                                display: 'flex'

                            }}
                        >{`Send ${feedbackMailType} Mail`}
                            <span
                                style={{
                                    backgroundColor:
                                        feedbackMailType === 'Acceptance'
                                            ? "#E7FCF3"
                                            : feedbackMailType === 'Rejection'
                                                ? "#ffeae9"
                                                : "",
                                    color:
                                        feedbackMailType === 'Acceptance'
                                            ? "#09AA61"
                                            : feedbackMailType === 'Rejection'
                                                ? "#D10000"
                                                : "",
                                    fontWeight: 700,
                                    borderWidth: "1px",
                                    borderStyle: "solid",
                                    borderColor:
                                        feedbackMailType === 'Acceptance'
                                            ? "#09AA61"
                                            : feedbackMailType === 'Rejection'
                                                ? "#D10000"
                                                : "",
                                    fontSize: "10px",
                                    padding: "7px",
                                    marginLeft: "10px",
                                    borderRadius: "4px",
                                }}
                            >
                                {feedbackMailType === 'Acceptance' ? 'Selected' : feedbackMailType === 'Rejection' ? 'Rejected' : ''}
                            </span>

                        </Box>
                        <Box
                            onClick={() => setFeedbackMailType(feedbackMailType === "Acceptance" ? "Rejection" : feedbackMailType === "Rejection" ? "Acceptance" : "")}
                            sx={{
                                color: '#2877EE',
                                // font: 'Lato',
                                fontWeight: '500',
                                fontSize: '14px',
                                textDecoration: 'underline',
                                cursor: "pointer",
                            }}>
                            {`Switch to ${feedbackMailType === 'Acceptance' ? 'Rejection' : 'Acceptance'} Mail`}
                        </Box>
                    </Box>
                </ModalHeader>
                <ModalCloseButton
                    mt='12px'
                    fontSize={'8px'}
                    fontWeight={700}
                    _hover={'#858D9D'}
                    _active={'#858D9D'}
                    backgroundColor={'#858D9D'}
                    height={'20px'}
                    width={'20px'}
                    borderRadius={'50%'}
                    color={'#FFFFFF'}
                />
                <ModalBody p='0px' m='0px' backgroundColor="#F9F9FC"
                >
                    {loading ?
                        <Box
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            height={'70vh'}
                        >
                            <Spinner size='lg' />
                        </Box> : <Box sx={{ display: 'flex', gap: '20px' }}>
                            <Box
                                padding="14px"
                                margin={'20px 0px 20px 20px'}
                                backgroundColor="#FFFFFF"
                                height={'70vh'}
                                overflow={'auto'}
                                // border={'1px solid red'}
                                width={'50%'}
                                position={'relative'}>
                                <Box>
                                    <Box
                                        sx={{
                                            fontWeight: '700',
                                            fontSize: '12px',
                                            color: '#1D1F2C'
                                        }}
                                    >
                                        What To Have In Header?
                                    </Box>
                                    <Box
                                        sx={{
                                            marginTop: '16px',
                                            display: 'flex',
                                            paddingBottom: '14px',
                                            borderBottom: '1px dashed #E0E2E7'
                                        }}>
                                        <Box
                                            sx={{ width: '50%' }}>
                                            {feedbackHeaderData.map((field) => field.id <= 3 ? <Box key={field.id} marginBottom={'16px'}><CustomCheckbox id={field.id} label={field.name} disabled={field.isDisabled} defaultChecked={field.isChecked} onChange={handleFeedbackHeaderData} /></Box> : <></>)}
                                        </Box>
                                        <Box
                                            sx={{
                                                width: '50%',

                                            }}>
                                            {feedbackHeaderData.map((field) => field.id > 3 ? <Box key={field.id} marginBottom={'16px'}><CustomCheckbox id={field.id} label={field.name} disabled={field.isDisabled} defaultChecked={field.isChecked} onChange={handleFeedbackHeaderData} /></Box> : <></>)}
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        padding: '20px 0px 7px 0px',
                                        borderBottom: '1px dashed #E0E2E7'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            fontWeight: '700',
                                            fontSize: '12px',
                                            color: '#1D1F2C'
                                        }}
                                    >
                                        Show Score Circles?
                                    </Box>
                                    <Box
                                        sx={{ display: 'flex', marginTop: '14px', gap: '16px' }}>
                                        {feedbackShowCircleData.map((field) => <Box key={field.id} marginBottom={'16px'}><CustomCheckbox id={field.id} label={field.name} disabled={field.isDisabled} defaultChecked={field.isChecked} onChange={handleFeedackCircleShowData} /></Box>)}
                                    </Box>
                                </Box>
                                <Box sx={{ padding: '20px 0px 20px 0px' }}>
                                    {feedbackOverviewData.map((field) => <Box sx={{ display: 'flex', marginBottom: '16px' }} key={field.id}>
                                        <Box sx={{ fontSize: '12px', fontWeight: '600', color: '#282C36', width: '55%' }}>{field.name}</Box>
                                        <Box>
                                            <button onClick={() => handleFeedbackOverviewData(field.id, true)} style={{
                                                width: '35px',
                                                height: '20px',
                                                borderRadius: '6px',
                                                border: '1px solid #6DAA39',
                                                fontSize: '12px',
                                                color: field.flag ? '#FFFFFF' : '#6DAA39',
                                                backgroundColor: field.flag ? '#6DAA39' : '',
                                                paddingTop: '1px',
                                                fontWeight: 'bold'
                                            }}>
                                                Yes</button>
                                        </Box>
                                        <Box>
                                            <button
                                                onClick={() => handleFeedbackOverviewData(field.id, false)}
                                                style={{
                                                    width: '35px',
                                                    height: '20px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #EB7E76',
                                                    fontSize: '12px',
                                                    color: !field.flag ? '#FFFFFF' : '#EB7E76',
                                                    backgroundColor: !field.flag ? '#EB7E76' : '',
                                                    paddingTop: '1px',
                                                    marginLeft: '10px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                No</button>
                                        </Box>
                                    </Box>)}
                                </Box>
                                <Box
                                    sx={{
                                        fontSize: '8px',
                                        fontWeight: '600',
                                        color: '#0D111B',
                                        // border: '1px solid red',
                                        position: 'absolute',
                                        bottom: '2'
                                    }}
                                >All Fields Are Mandatory</Box>
                            </Box>
                            <Box
                                padding="14px"
                                margin={'20px 20px 20px 0px'}
                                backgroundColor="#FFFFFF"
                                height={'70vh'}
                                overflow={'auto'}
                                // border={'1px solid red'}
                                width={'50%'}>

                                <Box
                                    sx={{
                                        fontWeight: '700',
                                        fontSize: '12px',
                                        color: '#1D1F2C',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Box>{`${feedbackMailType === "Acceptance" ? 'Acceptance' : feedbackMailType === "Rejection" ? 'Rejection' : ''} Email Draft`}</Box>
                                    <Box
                                        display={'flex'}
                                        alignItems={'center'}
                                        // opacity={0.2}
                                        onClick={handleEditEmailDraft}
                                    >
                                        <img src={editIcon.src}
                                            alt="icon"
                                            style={{ cursor: "pointer", height: "17px" }} />
                                        <span style={{ fontSize: "12px", color: "#1D1F2C", marginLeft: "5px", fontWeight: 400, cursor: "pointer" }}>Edit</span>
                                    </Box>
                                </Box>
                                <Box
                                    height={'55vh'}
                                    // border={'1px solid #E0E2E7'}
                                    border={`${editFeedbackEmailDraft ? '1px dashed rgb(29, 31, 44)' : '1px solid #E0E2E7'}`}
                                    width={'100%'}
                                    borderRadius={'6px'}
                                    padding={'10px'}
                                    marginBottom={'14px'}
                                >
                                    <Box
                                        sx={{
                                            fontSize: '12px',
                                            fontWeight: '400',
                                            color: `${editFeedbackEmailDraft ? '#000000' : '#282C36B2'}`,
                                            height: '100%'
                                        }}>
                                        {/* <span>Dear Candidate,</span> <br/> <br/> */}

                                        {/* {feedbackMailType === "Acceptance" ? <> */}
                                        <textarea
                                            value={feedBackMailText}
                                            onChange={(e) => setFeedBackMailText(e.target.value)}
                                            disabled={!editFeedbackEmailDraft}
                                            ref={emailDraftRef}
                                            onBlur={() => setEditFeedackEmailDraft(false)}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                resize: 'none',
                                                outline: 'none',
                                                background: 'none'
                                            }}></textarea>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '27px' }}>
                                    <Box
                                        onClick={() => handleFeedbackPdfPreview()}
                                        fontSize={'14px'}
                                        fontWeight={500}
                                        color={'#003D86'}
                                        display={'flex'}
                                        gap='7px'
                                        alignItems={'center'}
                                        cursor={'pointer'}
                                        // onClick={() => props.onClick()}
                                        padding='8px 15px'
                                    >
                                        <img src={previewIcon.src} alt='icon' />
                                        Preview PDF
                                        {/* <Download /> */}
                                    </Box>
                                    <Box
                                        fontSize={'12px'}
                                        fontWeight={500}
                                        color={'white'}
                                        display={'flex'}
                                        gap='16px'
                                        alignItems={'center'}
                                        cursor={'pointer'}
                                        onClick={() => handleSendFeedback(feedbackMailType === "Acceptance" ? 'acceptance' : feedbackMailType === "Rejection" ? 'rejection' : '')}
                                        padding='8px 15px'
                                        backgroundColor={'#003D86'}
                                        borderRadius={'6px'}

                                    >
                                        Send Feedback As Mail
                                        {/* <Download /> */}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    }

                </ModalBody>
            </ModalContent >
        </Modal >
    )
}

export default InterviewResultPopup