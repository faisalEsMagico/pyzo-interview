import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import InterviewResultPopup from './InterviewResultPopup';
import { getInterviewResultForSingleCandidate } from '../../services/jobListingApi';
import toast from 'react-hot-toast';
import { Backdrop, CircularProgress } from '@material-ui/core';
import a2zIcon from '../../assets/svg/a2zIcon.svg'
import tableSortIcon from '../../assets/svg/tableSortIcon.svg'
import dayjs from 'dayjs';
import PaginatedItems from '../job-listing/Pagination';
import SelectTag from '../ui-components/SelectTag';
import { useRouter } from 'next/router';
import acceptIcon from '../../assets/svg/AcceptIcon.svg';
import declineIcon from '../../assets/svg/DeclineIcon.svg';
import { Tooltip } from '@chakra-ui/react';
import TooltipIcon from "../../assets/svg/TooltipIcon.svg";
import disableAcceptIcon from "../../assets/svg/DisableAcceptIcon.svg";
import disableDeclineIcon from "../../assets/svg/DisableDeclineIcon.svg";

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

const InterviewResultTable = ({
    data,
    setIsUpdate,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    totalPage,
    setTotalPage,
    totalDataCount
}: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [candidateData, setCandidateData] = useState({})
    const [loading, setLoading] = useState(false)
    const [isHovered, setIsHovered] = useState<number>(-1);
    const router = useRouter();
    const [feedbackMailType, setFeedbackMailType] = useState<string>("");

    const handleInterviewDetails = async (id: any, flag: boolean) => {
        if (flag === false) {
            return;
        }
        setLoading(true)
        try {
            const resp = await getInterviewResultForSingleCandidate(id)
            setCandidateData(resp?.detail)
            setLoading(false)
            setIsOpen(true)
        } catch (e) {
            console.log('error for get interview result for single candidate api', e)
            toast.error('Something went wrong!')
            setLoading(false)
        }
    }

    const handleApplicantResult = (id: string, flag: boolean) => {
        router.push(`applicant-result?candidateId=${id}&feedbackFlag=${flag}`)
    }

    return (
        <Box
            sx={{
                height: "80vh",
                position: 'relative'
            }}
        >
            {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>}
            <InterviewResultPopup
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                data={candidateData}
                handleInterviewDetails={handleInterviewDetails}
                feedbackMailType={feedbackMailType}
                setFeedbackMailType={setFeedbackMailType}
            />
            <Box
                sx={{
                    height: "100vh",
                    overflowY: "auto",
                    borderRadius: "10px",
                    backgroundColor: "#FFFFFF",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        textAlign: "left",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead
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
                                    fontWeight: 700,

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
                                    fontWeight: 700,
                                    textAlign: "left",
                                }}
                                width="20%"
                            >
                                <Box
                                    display='flex'
                                    justifyContent={'flex-start'}
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
                                    fontWeight: 700,
                                    textAlign: "left"
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
                                    fontWeight: 700,
                                    textAlign: "left"
                                }}
                                width="12%"
                            >
                                Phone No
                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 700,
                                    textAlign: "left"
                                }}
                                width="12%"
                            >
                                <Box
                                    display='flex'
                                    justifyContent={'flex-start'}
                                    gap='5px'
                                >
                                    Interview Date <img src={tableSortIcon.src} alt='icon' />
                                </Box>
                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 700,
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
                                    fontWeight: 700,
                                }}
                                width="12%"
                            >
                                <Box
                                    display='flex'
                                    justifyContent={'flex-start'}
                                    gap='5px'
                                >
                                    Send Email <img src={tableSortIcon.src} alt='icon' />
                                </Box>
                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 700,
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
                                    key={index}
                                    onMouseEnter={() => setIsHovered(index)}  // Set hover state to true
                                    onMouseLeave={() => setIsHovered(-1)}
                                    style={{
                                        backgroundColor: isHovered == index ? '#E4E4F0' : checkEvenOrOdd(index) ? "#F9F9FC" : "#FFFFFF",
                                        padding: "11px",
                                    }}
                                >
                                    <td
                                        // @ts-ignore
                                        style={{
                                            ...textStyle,
                                            color: "#272728",
                                            textAlign: "left",
                                        }}
                                    >
                                        {(currentPage - 1) * perPage + index + 1}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{ ...textStyle, textAlign: "left", color: '#043A87' }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: "8px",
                                                alignItems: "center",
                                                textDecoration: 'underline',
                                                cursor: "pointer"
                                            }}
                                            onClick={() => handleApplicantResult(application?.id, application?.feedback_generated_flag)}
                                        >
                                            {application?.name}
                                        </Box>
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{
                                            ...textStyle,
                                            textAlign: "left",
                                            color: '#1D1F2C'
                                        }}
                                    >
                                        {application?.email}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{
                                            ...textStyle,
                                            textAlign: "left",
                                            color: '#1D1F2C'
                                        }}
                                    >
                                        {application?.phone}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{
                                            ...textStyle,
                                            textAlign: "left",
                                        }}
                                    >
                                        {dayjs(application?.created).format('DD/MM/YYYY')}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{
                                            ...textStyle,
                                            textAlign: "left",
                                        }}
                                    >
                                        {application.jobdescription__job_title}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{ ...textStyle, textAlign: "left" }}
                                    >
                                        <Box
                                            onClick={() => handleInterviewDetails(application.id, application?.feedback_generated_flag)}
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: '12px',
                                                color: "#5D79C2",
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                                display: 'flex',
                                                // justifyContent: 'center',
                                                gap: '12px',
                                                paddingLeft: '22px',
                                            }}>
                                            <Box
                                                onClick={() => setFeedbackMailType("Acceptance")}
                                            >
                                                <img src={application?.feedback_generated_flag ? acceptIcon.src : disableAcceptIcon.src} alt='icon' color="grey" />
                                            </Box>
                                            <Box
                                                onClick={() => setFeedbackMailType("Rejection")}
                                            >
                                                <img src={application?.feedback_generated_flag ? declineIcon.src : disableDeclineIcon.src} alt='icon' />
                                            </Box>
                                            {!application?.feedback_generated_flag && <Tooltip label="Interview feedback not generated. Please purchase credits and refresh." width="170px" fontWeight="400" fontSize="8px" bg="#E4E4F0" color="#00000" placement="top-start">
                                                <img src={TooltipIcon.src} width="16px" alt="tooltip" />
                                            </Tooltip>}
                                        </Box>
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={textStyle}
                                    >
                                        <span
                                            style={{
                                                backgroundColor: application.status === 'Interview Rejected' ? '#ffeae9' :
                                                    application.status === 'Interview Selected' ? '#e7fcf3' : '#FFFFFF',
                                                padding: "8px",
                                                color: application.status === 'Interview Rejected' ? "#D10000" :
                                                    application.status === 'Accepted for Position' ? " #5D79C2 " : '#009220',
                                                border: application.status === 'Interview Rejected' ? "#D10000" :
                                                    application.status === 'Accepted for Position' ? " #5D79C2 " : '#009220',
                                                borderStyle: "solid",
                                                borderWidth: '1px',
                                                fontWeight: 700,
                                                fontSize: '10px',
                                                textAlign: "center",
                                                borderRadius: "4px"
                                            }}
                                        >
                                            {application.status}
                                        </span>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr
                                style={{
                                    backgroundColor: "#FFFFFF",
                                }}
                            >
                                <td
                                    align="center"
                                    colSpan={8}
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
                    // height={'60px'}
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
                                    console.log('total page')
                                    setPerPage(value)
                                    setCurrentPage(1)
                                }}
                                menuPlacement='top'
                                placeholder=''
                                options={[{ label: "15", value: '15' }, { label: "20", value: '20' }, { label: "30", value: '30' }]}
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

export default InterviewResultTable;
