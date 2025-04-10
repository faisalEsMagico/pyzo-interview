import React, { useRef, useState, useEffect } from 'react'
import {
    Box,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'
import deleteIcon from '../../assets/svg/archiveIcon.svg'
import editIcon from '../../assets/svg/editIcon.svg'
import copy from '../../assets/svg/copy.svg'
import { useRouter } from 'next/router';

const JobListingPreviewPopup = ({ isOpen,
    onClose,
    data,
    handleArchive,
    isCopied,
    setIsCopied,
    handleNext }: any) => {

    const [domain, setDomain] = useState('');
    const jobListingRef = useRef(null);
    const router = useRouter()

    const copyContent = () => {
        const range = document.createRange();
        jobListingRef?.current && range.selectNodeContents(jobListingRef?.current);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        try {
            document.execCommand('copy');
            alert('Link copied!');
        } catch (err) {
            console.error('Failed to copy link:', err);
        }

        selection?.removeAllRanges(); // Clear the selection after copying
    };

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(`${domain}/interview-form?jobId=${data.id}&recruiterId=${localStorage.getItem('userId')}`)
            .then(() => {
                alert("Job Listing Link copied to clipboard");
                console.log("Text copied to clipboard");
                if (!isCopied) {
                    handleNext(1);
                }
                setIsCopied(true);
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    };


    useEffect(() => {
        if (typeof window !== 'undefined') {
            setDomain(window.location.origin);
        }
    }, []);

    const handleEdit = (id: string) => {
        router.push(`/job-listing/create-new-job?editId=${id}`)
    }

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size='4xl'>

            {OverlayOne()}
            {/* @ts-ignore */}
            <ModalContent borderRadius="24px" overflow="hidden">
                <ModalHeader
                    bg='#FFFFFF'
                    fontSize={'18px'}
                    fontWeight={600}
                    color='#1D1F2C'
                    paddingRight={'60px'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    borderRadius={'12px'}
                >
                    <Box>Preview Job Listing  <span
                        // @ts-ignore
                        style={{
                            backgroundColor: data?.delete_flag ? "#E7EFFC" : "#E7FCF3",
                            padding: "4px 8px",
                            color: data?.delete_flag ? '#2877EE' : '#09AA61',
                            fontWeight: 700,
                            fontSize: '10px',
                            textAlign: "center",
                            borderRadius: "4px",
                            border: `1px solid ${data?.delete_flag ? '#2877EE' : '#09AA61'}`,
                            marginLeft: "10px"
                        }}
                    >
                        {data?.delete_flag === true ? 'Archive' : data?.delete_flag === false ? 'Active' : '--'}
                    </span>
                    </Box>
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                        gap={'20px'}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                gap: '10px',
                                alignItems: "center",
                                justifyContent: "right",
                                fontSize: "12px", color: "#1D1F2C", marginLeft: "5px", fontWeight: 400
                            }}
                        >
                            <img src={copy.src}
                                alt="icon"

                                // onClick={copyContent}
                                onClick={copyToClipboard}
                                style={{ cursor: "pointer" }}
                            />

                            Copy Job Listing Link
                        </Box>
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            opacity={data?.delete_flag ? 0.2 : 1}
                        >
                            <img src={editIcon.src}
                                alt="icon"

                                onClick={() => !data.delete_flag && data?.id ? handleEdit(data?.id) : () => { }}
                                style={{ cursor: data?.delete_flag ? '' : data?.id ? "pointer" : 'no-drop' }}
                            />
                            <span style={{ fontSize: "12px", color: "#1D1F2C", marginLeft: "5px", fontWeight: 400 }}>Edit</span>
                        </Box>
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                        >
                            <img
                                src={deleteIcon.src}
                                alt="icon"
                                style={{ cursor: data?.id ? "pointer" : 'no-drop' }}
                                onClick={() => data?.id ? handleArchive(data?.id, data?.delete_flag, data?.job_title) : () => { }}
                            />
                            <span style={{ fontSize: "12px", color: "#1D1F2C", marginLeft: "5px", fontWeight: 400 }}>{data?.delete_flag ? "Archived" : 'Archive'}</span>
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
                <ModalBody bg={'#F7F9FC'} p='10px' >
                    <Box
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: '#1D1F2C',
                            padding: "16px",
                            border: "1px solid #CFD6DC",
                            borderRadius: '6px',
                            marginX: "20px",
                            height: "400px",
                            overflow: 'auto',
                            backgroundColor: '#FFFFFF',
                            marginBottom: '30px'
                        }}
                    >
                        <Box
                            ref={jobListingRef}
                            width={'60%'}
                        >
                            <Box
                                marginBottom={'10px'}
                            >Job Title: <span style={{ fontWeight: 400 }} >{data?.job_title ? data?.job_title : '--'}</span></Box>
                            <Box>Job Description</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                            >{data?.job_description ? data?.job_description : '--'}</Box>
                            <Box>Role And Responsibility</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                            >
                                {data?.roles_and_responsibilities ? data?.roles_and_responsibilities : '--'}</Box>
                            <Box>About The Company</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                            >{data?.about_company ? data?.about_company : '--'}</Box>
                            <Box>Skills Required</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                            >{data?.skills_required ? data?.skills_required : '--'}</Box>
                            <Box>Years of experience required?</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                            >{data?.years_of_experience ? data?.years_of_experience : '--'}</Box>
                            <Box>What is your expected salary ? (In LPA)</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                            >{data?.salary ? data?.salary : '--'}</Box>
                            <Box>What is your expected Location ?</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                            >{data?.location ? data?.location : '--'}</Box>
                            <Box>Preferred mode of work</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                            >{data?.mode_of_work ? data?.mode_of_work : '--'}</Box>
                        </Box>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}

export default JobListingPreviewPopup