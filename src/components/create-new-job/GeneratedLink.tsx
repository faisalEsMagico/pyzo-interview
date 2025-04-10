
import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaLink } from "react-icons/fa";
import BulkUploadButton from "./BulkUploadButton";
import { IoEyeOutline } from "react-icons/io5";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { getShortlistedCandidate } from "../../services/jobListingApi";
import SaveResumesPopup from "./SaveResumesPopup";
import copy from '../../assets/svg/copy.svg'
import { Backdrop, CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";

const GeneratedLink = ({ handleBack, handleNext, isCopied, setIsCopied, questions, setIsUpdate }: any) => {
    const [domain, setDomain] = useState('');
    const [resumes, setResumes] = useState([])
    const [jobId, setJobId] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetchCandidateResume, setFetchCandidateResume] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const jobListingRef = useRef(null);
    const router = useRouter()

    const handleEdit = () => {
        handleBack(2);
        setIsUpdate(true)
    }

    const copyContent = () => {
        const range = document.createRange();
        jobListingRef?.current && range.selectNodeContents(jobListingRef?.current);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        try {
            document.execCommand('copy');
            alert('Content copied!');
        } catch (err) {
            console.error('Failed to copy content:', err);
        }

        selection?.removeAllRanges(); // Clear the selection after copying
    };

    useEffect(() => {
        const id = localStorage.getItem('JDID') ?? ''
        if (typeof window !== 'undefined') {
            setDomain(window.location.origin);
        }
        setJobId(id)
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(`${domain}/interview-form?jobId=${jobId}&recruiterId=${localStorage.getItem('userId')}`)
            .then(() => {
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

    const handleShortListingCandidate = async (id: string) => {
        setLoading(true)
        try {
            const resp = await getShortlistedCandidate(id)
            console.log(resp)
            setResumes(resp?.candidates)
            setLoading(false)
            setIsOpen(true)
        } catch (e) {
            console.log('error while calling shortlisting candidate Api:-', e)
            setLoading(false)
            setIsOpen(true)
        }
    }

    return (
        <div>
            {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>}
            <SaveResumesPopup isOpen={isOpen} onClose={() => setIsOpen(false)} data={resumes} />
            <Box
                sx={{
                    padding: "12px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "5px",
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginX: "20px",
                    border: "1px solid #CFD6DC"
                }}
            >
                <Box sx={{ color: "#000000", fontWeight: 500, fontSize: "14px" }}>
                    {questions[0]?.value}
                </Box>
                {/* @ts-ignore */}
                <Button leftIcon={<FaRegPenToSquare />}
                    _hover={{ bg: "#EBF2FB" }}  // Change this to your desired hover color
                    _active={{ bg: "#EBF2FB" }}
                    bg={'#EBF2FB'}
                    color={'#003D86'}
                    style={{ fontSize: "12px", fontWeight: 500 }} variant='solid'
                    onClick={handleEdit}
                >
                    Edit Job Listing
                </Button>
            </Box>
            <Box
                sx={{
                    padding: "12px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "5px",
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginX: "20px",
                    border: "1px solid #CFD6DC"
                }}
            >
                <Box sx={{ color: "#000000", fontWeight: 500, fontSize: "14px" }}>
                    Skill Set Generated By AI
                </Box>
                {/* @ts-ignore */}
                <Button leftIcon={<FaRegPenToSquare />}
                    _hover={{ bg: "#EBF2FB" }}  // Change this to your desired hover color
                    _active={{ bg: "#EBF2FB" }}
                    bg={'#EBF2FB'}
                    color={'#003D86'}
                    style={{
                        padding: '0px 27px',
                        fontSize: "12px",
                        fontWeight: 500
                    }}
                    variant='solid'
                    onClick={() => handleBack(1)}
                >
                    Edit Skill Set
                </Button>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "22px 20px 10px 20px",
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1D1F2C'
                }}
            >
                <Box

                >Preview of the Job Listing</Box>
                <Box
                    sx={{
                        display: "flex",
                        gap: '10px',
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <img src={copy.src}
                        alt="icon"
                        onClick={copyContent}
                        style={{ cursor: "pointer" }}
                    />
                    Copy the Job Listing
                </Box>
            </Box>

            <Box
                sx={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: '#1D1F2C',
                    padding: "16px",
                    border: "1px solid #CFD6DC",
                    borderRadius: '6px',
                    marginX: "20px",
                    height: "328px",
                    overflow: 'auto',
                }}
                ref={jobListingRef}
            >
                <Box
                    width="60%"
                >
                    <Box
                        marginBottom={'10px'}
                    >Job Title: <span style={{ fontWeight: 400 }} >{questions[0]?.value}</span></Box>
                    <Box>Job Description</Box>
                    <Box
                        fontWeight={400}
                        marginBottom={'10px'}
                    >{questions[1]?.value}</Box>
                    <Box>Role And Responsibility</Box>
                    <Box
                        fontWeight={400}
                        marginBottom={'10px'}
                    >{questions[2]?.value}</Box>
                    <Box>About The Company</Box>
                    <Box
                        fontWeight={400}
                        marginBottom={'10px'}
                    >{questions[3]?.value}</Box>
                    <Box>Skills Required</Box>
                    <Box
                        fontWeight={400}
                        marginBottom={'10px'}
                    >{questions[4]?.value}</Box>
                    <Box>Years of experience required?</Box>
                    <Box
                        fontWeight={400}
                        marginBottom={'10px'}
                    >{questions[5]?.value}</Box>
                    <Box>What is your expected salary ? (In LPA)</Box>
                    <Box
                        fontWeight={400}
                        marginBottom={'10px'}
                    >{questions[6]?.value}</Box>
                    <Box>What is your expected Location ?</Box>
                    <Box
                        fontWeight={400}
                        marginBottom={'10px'}
                    >{questions[7]?.value}</Box>
                    <Box>Preferred mode of work</Box>
                    <Box
                        fontWeight={400}
                        marginBottom={'10px'}
                    >{questions[8]?.value}</Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    marginX: "20px",
                    marginBottom: "30px",
                    marginTop: "40px"
                }}
            >
                <Box
                    sx={{
                        display: "fex",
                        justifyContent: "center",
                        gap: "20px",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            padding: "7px",
                            border: "1px solid #E0E2E7",
                            borderRadius: "6px",
                            color: "#858D9D",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 400
                        }}
                    >
                        <FaLink color="#292D32" />   {domain}/interview-form?jobId={jobId}&recruiterId={localStorage.getItem('userId')}
                    </Box>
                    <Box>
                        <Button
                            size='sm'
                            onClick={copyToClipboard}
                            leftIcon={isCopied ? <RiCheckboxCircleFill size={20} /> : <></>}
                            bg={isCopied ? '#09AA61' : '#003D86'}
                            _hover={'#003D86'}
                            _active={'#003D86'}
                            color='#FFFFFF'
                            fontSize={'12px'}
                            fontWeight={500}
                            px='20px'
                        >
                            {isCopied ? 'Copied!' : "Copy Job Listing Link"}
                        </Button>
                    </Box>
                </Box>
                <Box
                    display={'flex'}
                    gap='20px'
                >
                    <BulkUploadButton title={questions[0]?.value} id={jobId} setFetchCandidateResume={setFetchCandidateResume} />
                    {/* @ts-ignore */}
                    <Button
                        size='sm'
                        leftIcon={<IoEyeOutline color={'#003D86'} size={16} />}
                        _hover='#FFFFFF'
                        _active='#FFFFFF'
                        bg='#FFFFFF'
                        color='#003D86'
                        border='1px solid #003D86'
                        onClick={() => handleShortListingCandidate(jobId)}
                        fontSize={'12px'}
                        fontWeight={500}
                        px='30px'
                    >
                        View resumes
                    </Button>
                    <Button
                        size='sm'
                        onClick={() => router.push('/job-listing')}
                        bg={'#003D86'}
                        _hover={'#003D86'}
                        _active={'#003D86'}
                        color='#FFFFFF'
                        fontSize={'12px'}
                        fontWeight={500}
                        p='7px 50px'
                    >
                        Done
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default GeneratedLink;
