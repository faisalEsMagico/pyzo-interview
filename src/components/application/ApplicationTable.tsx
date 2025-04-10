import { Box } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import ApplicationOverviewPopup from './ApplicationOverviewPopup';
import { Backdrop, CircularProgress } from '@material-ui/core';
import dayjs from 'dayjs';
import a2zIcon from '../../assets/svg/a2zIcon.svg';
import tableSortIcon from '../../assets/svg/tableSortIcon.svg';
import copy from '../../assets/svg/copy.svg';
import PaginatedItems from '../job-listing/Pagination';
import SelectTag from '../ui-components/SelectTag';
import { useRouter } from 'next/router';
import { generateInterviewLink } from '../../services/jobListingApi'
import toast from 'react-hot-toast'
import { getApplicationOverview } from '../../services/jobListingApi';
import { Tooltip } from '@chakra-ui/react';
import TooltipIcon from "../../assets/svg/TooltipIcon.svg";

function checkEvenOrOdd(number: number) {
    return number % 2 === 0
}

const textStyle = {
    fontFamily: "Inter-regular",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "17px",
    letterSpacing: "0.02em",
    textAlign: "center",
    color: "#1D1F2C",
    padding: "12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

const ApplicationTable = ({
    data,
    setIsUpdate,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    totalPage,
    setTotalPage,
    totalDataCount,
}: {
    data: any[],
    setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>,
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    perPage: number,
    setPerPage: React.Dispatch<React.SetStateAction<number>>,
    totalPage: number,
    setTotalPage: React.Dispatch<React.SetStateAction<number>>,
    totalDataCount: number,
}) => {
    const [interviewLink, setInterviewLink] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const [singleUserData, setSingleUserData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const [isHovered, setIsHovered] = useState<number>(-1);
    const router = useRouter();
    const { jobId } = router.query;

    // Function to generate interview link
    const handleGenerateInterviewLink = async () => {
        const candidateId = localStorage.getItem("candidateId");
        if (!candidateId) {
            toast.error('Candidate ID not found');
            return;
        }

        try {
            const resp = await generateInterviewLink({ jobid: jobId, candidate_id: candidateId });
            setInterviewLink(resp?.interview_link || '');
        } catch (e) {
            console.log('Error generating interview link:', e);
            toast.error('Something went wrong!');
        }
    };

    useEffect(() => {
        if (jobId) {
            handleGenerateInterviewLink();
        }
    }, [jobId]);



    const handleCandidatesDetails = async (id: string) => {
        router.push(`/applicant-details?candidateId=${id}`);
    };

    return (
        <Box
            sx={{
                height: "80vh",
                position: "relative",
            }}
        >
            {loading && <Backdrop open={true} // @ts-ignore
                style={{ zIndex: 999, color: "#fff" }}>
                <CircularProgress color="inherit" />

            </Backdrop>}
            <ApplicationOverviewPopup data={singleUserData[0]} isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <Box
                sx={{
                    height: "100vh",
                    overflowY: "auto",
                    backgroundColor: "#FFFFFF",
                }}
            >
                <table
                    // @ts-ignore
                    style={{
                        textAlign: "left",
                        borderCollapse: "collapse",
                        width: "100%",
                        overflow: "auto"
                    }}
                >
                    <thead
                        // @ts-ignore
                        style={{
                            backgroundColor: "#E4E4F0",
                            color: "#1D1F2C",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            borderTopRightRadius: "6px",
                            borderTopLeftRadius: "6px",
                            overflow: "hidden"
                        }}
                    >
                        <tr>
                            <th
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,
                                    textAlign: "left",
                                }}
                                width="5%"
                            >
                                Sr No
                            </th>
                            <th
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,
                                    textAlign: "center",
                                }}
                                width="15%"
                            >
                                <Box
                                    display='flex'
                                    gap='5px'
                                >
                                    Applicant Name <img src={a2zIcon.src} alt='icon' />
                                </Box>
                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,
                                    textAlign: "left",
                                }}
                                width="20%"
                            >
                                Email ID
                            </th>
                            <th
                                scope="col"

                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,
                                    textAlign: "left"
                                }}
                                width="15%"
                            >
                                Phone Number
                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,

                                }}
                                width="15%"
                            >

                                <Box
                                    display='flex'
                                    justifyContent={'flex-start'}
                                    gap='5px'
                                >
                                    Application Date <img src={tableSortIcon.src} alt='icon' />
                                </Box>
                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,
                                    textAlign: "right"
                                }}
                                width="15%"
                            >

                                <Box
                                    display='flex'
                                    justifyContent={'flex-start'}
                                    gap='5px'
                                >
                                    Job Listing <img src={tableSortIcon.src} alt='icon' />
                                </Box>
                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,
                                }}
                                width="15%"
                            >

                                <Box
                                    display='flex'
                                    justifyContent={'center'}
                                    gap='5px'
                                >
                                    Resume Screening <img src={tableSortIcon.src} alt='icon' />
                                </Box>
                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,

                                }}
                                width="15%"
                            >

                                <Box
                                    display='flex'
                                    justifyContent={'center'}
                                    gap='5px'
                                >
                                    AI Interview Link <img src={tableSortIcon.src} alt='icon' />
                                </Box>
                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,

                                }}
                                width="15%"
                            >
                                <Box
                                    display='flex'
                                    justifyContent={'center'}
                                    gap='5px'
                                >
                                    Interview Status <img src={tableSortIcon.src} alt='icon' />
                                </Box>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.length > 0 ? (
                            data?.map((application: any, index: number) => (
                                <tr
                                    key={application.id}
                                    onMouseEnter={() => setIsHovered(index)}  // Set hover state to true
                                    onMouseLeave={() => setIsHovered(-1)}
                                    // @ts-ignore
                                    style={{
                                        backgroundColor: isHovered == index ? '#E4E4F0' :
                                            checkEvenOrOdd(index) ? "#F9F9FC" : "#FFFFFF",
                                        cursor: "pointer"
                                    }}
                                >
                                    <td
                                        // @ts-ignore
                                        style={{
                                            ...textStyle,
                                            padding: "11px",
                                            color: "#272728",
                                            textAlign: "left",
                                        }}
                                    >
                                        {(currentPage - 1) * perPage + index + 1}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{ ...textStyle, textAlign: "left" }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: "8px",
                                                alignItems: "center",
                                            }}
                                            onClick={() => handleCandidatesDetails(application.id)}
                                        >
                                            <Box // @ts-ignore
                                                style={{
                                                    color: '#043A87',
                                                    fontWeight: 400,
                                                    fontSize: '12px',
                                                    cursor: "pointer",
                                                    textDecoration: "underline"
                                                }}>{application.name ?? '--'}</Box>
                                        </Box>
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{
                                            ...textStyle,
                                            textAlign: "left",
                                        }}
                                    >
                                        {application.email ?? '--'}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{
                                            ...textStyle,
                                            textAlign: "left",
                                        }}
                                    >
                                        {application.phone ?? '--'}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{
                                            ...textStyle,
                                            textAlign: "left",
                                        }}
                                    >
                                        {dayjs(application.created).format('DD/MM/YYYY')}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{
                                            ...textStyle,
                                            textAlign: "left",
                                        }}
                                    >
                                        {application.jobdescription__job_title ?? '--'}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={textStyle}
                                    >
                                        <span
                                            // @ts-ignore
                                            style={{
                                                color: application.status === 'Resume Accepted' ||
                                                    application.status === 'Interview Done' ||
                                                    application.status === 'Interview Selected' ?
                                                    "#009220" : application.status === 'Interview Rejected' ||
                                                        application.status === 'Resume Rejected' ?
                                                        "#D10000" : application.status === 'Link Shared' ||
                                                            application.status === 'Accepted for Position' ?
                                                            '#5D79C2' : "#747474",
                                                padding: "8px",
                                                backgroundColor: "#FFFFFF",
                                                fontWeight: 700,
                                                fontSize: '10px',
                                                textAlign: "center",
                                                borderRadius: "4px",
                                                borderColor: application.status === 'Resume Accepted' ||
                                                    application.status === 'Interview Done' ||
                                                    application.status === 'Interview Selected' ?
                                                    "#009220" : application.status === 'Interview Rejected' ||
                                                        application.status === 'Resume Rejected' ?
                                                        "#D10000" : application.status === 'Link Shared' ||
                                                            application.status === 'Accepted for Position' ?
                                                            '#5D79C2' : "#747474",
                                                borderWidth: "1px",
                                                borderStyle: "solid"
                                            }}
                                        >
                                            {application.status ?? '--'}
                                        </span>
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{ ...textStyle, textAlign: "center" }}
                                    >
                                        {['Resume Accepted', 'Link Shared'].includes(application.status) ? (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: "7px"
                                                }}
                                            >
                                                <a
                                                    style={{
                                                        color: "#003D86",
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                        textDecoration: "underline",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                    }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        // Call the function to generate the interview link
                                                        try {
                                                            const candidateId = application.id;
                                                            const res = await getApplicationOverview(candidateId);
                                                            if (res && res.detail && res.detail.length > 0) {
                                                                const applicationDetail = res.detail[0];
                                                                const jobId = applicationDetail.jobdescription_id;
                                                                const resp1 = await generateInterviewLink({ jobid: jobId, candidate_id: candidateId, recruiter_id: localStorage.getItem('userId') });
                                                                application.status = 'Link Shared';
                                                            }
                                                        }
                                                        catch (error) {
                                                            console.error('Error sending interview link:', error);
                                                            alert('Failed to send interview link');
                                                        }
                                                    }}
                                                >
                                                    Send Link
                                                    <img
                                                        src={copy.src}
                                                        alt="copy"
                                                        style={{
                                                            width: "12px",
                                                            height: "12px",
                                                            marginLeft: "10px",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            if (application.interview_link) {
                                                                navigator.clipboard.writeText(application.interview_link)
                                                                    .then(() => {
                                                                        alert('Interview link copied to clipboard');
                                                                    })
                                                                    .catch((err) => {
                                                                        console.error('Failed to copy content:', err);
                                                                        alert('Failed to copy content');
                                                                    });
                                                            } else {
                                                                alert('No interview link available to copy');
                                                            }
                                                        }}
                                                    />
                                                </a>
                                                {(application?.resume_shortlisting_status && application?.interview_link === null && application?.status !== "Link Shared") &&
                                                    <Tooltip label="Interview link not generated. Please purchase credits and click send link."
                                                        width="170px"
                                                        fontWeight="400"
                                                        fontSize="8px"
                                                        bg="#E4E4F0"
                                                        color="#00000"
                                                        placement="top-start"
                                                    >
                                                        <img src={TooltipIcon.src} width="16px" alt="tooltip" />
                                                    </Tooltip>}
                                            </Box>
                                        ) : (
                                            <span
                                                style={{
                                                    color: "#AAAAAA",
                                                    fontSize: "12px",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Send Link
                                            </span>
                                        )}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{ ...textStyle, textAlign: "center" }}
                                    >
                                        <span
                                            style={{
                                                border: application?.status === 'Interview Selected' || application?.status === 'Interview Rejected'
                                                    ? `1px solid ${application?.status === 'Interview Selected' ? '#09AA61' : '#E25247'}`
                                                    : 'none',
                                                color: application?.status === 'Interview Selected' || application?.status === 'Interview Rejected'
                                                    ? `${application?.status === 'Interview Selected' ? '#09AA61' : '#E25247'}`
                                                    : '#747474',
                                                backgroundColor: application?.status === 'Interview Selected' || application?.status === 'Interview Rejected'
                                                    ? `${application?.status === 'Interview Selected' ? '#E7FCF3' : '#FFEAE9'}`
                                                    : 'transparent',
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "12px"
                                            }}
                                        >
                                            {application?.status === 'Interview Selected'
                                                ? "Selected"
                                                : application?.status === 'Interview Rejected'
                                                    ? "Rejected"
                                                    : "--"}
                                        </span>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr
                                // @ts-ignore
                                style={{
                                    backgroundColor: "#FFFFFF",
                                }}
                            >
                                <td
                                    align="center"
                                    colSpan={9}
                                    // @ts-ignore
                                    style={{ padding: "11px", color: "#272728", fontSize: "12px" }}
                                >
                                    No Data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Box>
            <Box
                pb='12px'
            >
                <Box
                    mb='30px'
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    backgroundColor={'#FFFFFF'}
                    borderTop={'1px solid #E0E2E7'}
                    borderBottomRightRadius={'6px'}
                    p='8px 18px'
                    borderBottomLeftRadius={'6px'}
                >
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        fontSize={'12px'}
                        color={'#667085'}
                    >
                        <span style={{ marginRight: "10px" }}>showing:</span>
                        <Box width={'80px'}>
                            <SelectTag
                                value={perPage}
                                onChange={(value: any) => {
                                    setPerPage(value)
                                    setCurrentPage(1)
                                }}
                                menuPlacement='top'
                                placeholder=''
                                options={[{ label: "15", value: '15' },
                                { label: "20", value: '20' },
                                { label: "30", value: '30' }]}
                            />
                        </Box>
                        <span style={{ marginLeft: "10px" }}>
                            {(parseInt(currentPage) * parseInt(perPage)) -
                                parseInt(perPage) + 1}-{currentPage == totalPage ?
                                    (parseInt(currentPage) - 1) * parseInt(perPage) + totalDataCount - (parseInt(currentPage) - 1) * parseInt(perPage) :
                                    parseInt(currentPage) * parseInt(perPage)}
                            <span style={{ padding: "0px 5px" }}>to</span>{totalDataCount}</span>
                    </Box>
                    <PaginatedItems
                        itemsPerPage={perPage}
                        totalPage={totalPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage} />
                </Box>
            </Box>
        </Box >
    );
};

export default ApplicationTable;
