import { Box, Tooltip, useDisclosure } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import editIcon from '../../assets/svg/editIcon.svg'
import deleteIcon from '../../assets/svg/archiveIcon.svg'
import BulkUploadDrawer from './BulkUploadDrawer';
import { deleteJob, putRequiredSkills } from '../../services/jobListingApi';
import toast from 'react-hot-toast';
import { Backdrop, CircularProgress } from '@material-ui/core';
import a2zIcon from '../../assets/svg/a2zIcon.svg'
import tableSortIcon from '../../assets/svg/tableSortIcon.svg'
import copy from '../../assets/svg/copy.svg'
import TooltipCard from '../recorder/TooltipCard';
import PaginatedItems from './Pagination';
import SelectTag from '../ui-components/SelectTag';
import JobListingPreviewPopup from './JobListingPreviewPopup';
import AskToArchivePopup from './AskToArchivePopup';
import { useRouter } from 'next/router';

const textStyle = {
    fontFamily: "Inter-regular",
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "17px",
    letterSpacing: "0.02em",
    textAlign: "center",
    color: "#1D1F2C",
    padding: "12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};


function checkEvenOrOdd(number: number) {
    return number % 2 === 0
}

const JobListingTable = ({
    data,
    setIsUpdate,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    totalPage,
    setTotalPage,
    totalDataCount,
    isCopied, setIsCopied, handleNext
}: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [domain, setDomain] = useState('');
    const [jobId, setJobId] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [previewIndex, setPreviewIndex] = useState(0)
    const [isOpenPreview, setIsOpenPreview] = useState(false)
    const [isArchiveOpen, setIsArchiveOpen] = useState(false)
    const [isHovered, setIsHovered] = useState<number>(-1);
    const [archiveId, setArchiveId] = useState('')
    const [archiveStatus, setArchiveStatus] = useState({
        jobListingTitle: '',
        status: false
    })
    const router = useRouter()


    const copyToClipboard = (index: number) => {
        navigator.clipboard
            .writeText(`${domain}/interview-form?jobId=${data[index].id}&recruiterId=${localStorage.getItem('userId')}`)
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


    const handleCopy = (index: number) => {
        const jobListing = data[index];
        const content = `
Job Title: ${jobListing.job_title}
Job Description: ${jobListing.job_description}
Role And Responsibility: ${jobListing.roles_and_responsibilities}
About The Company: ${jobListing.about_company}
Skills Required: ${jobListing.skills_required}
Years of experience required: ${jobListing.years_of_experience}
Expected salary (In LPA): ${jobListing.salary}
Expected Location: ${jobListing.location}
Preferred mode of work: ${jobListing.mode_of_work}
        `.trim();

        navigator.clipboard.writeText(content)
            .then(() => {
                toast.success("Job listing Link copied to clipboard", {
                    position: "top-right",
                    duration: 2000,
                });
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
                toast.error("Failed to copy job listing link", {
                    position: "top-right",
                    duration: 2000,
                });
            });
    };

    const handleBulkUpload = (id: number) => {
        setJobId(id)
        onOpen()
    }

    const handlePreview = (index: number) => {
        setPreviewIndex(index)
        setIsOpenPreview(true)
    }

    const handleArchive = (id: string, status: boolean, title: string) => {
        setArchiveStatus({
            jobListingTitle: title,
            status: status
        })
        setIsArchiveOpen(true)
        setArchiveId(id)
    }

    const handleEdit = (id: string) => {
        router.push(`job-listing/create-new-job?editId=${id}`)
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

    const handleDelete = async (id: number) => {
        const userId = localStorage.getItem('userId') ?? ''
        setLoading(true)
        try {
            const resp = await deleteJob(id, userId)
            toast.success('Job archived successfully!')
            setIsUpdate((pre: boolean) => !pre)
            setLoading(false)
        } catch (e) {
            console.log('error while calling delete job api:-', e)
            toast.error('Something went wrong, Please try again!')
            setLoading(false)
        }
    }

    return (
        <Box
            sx={{
                height: "80vh",
                maxHeight: "80vh",
                position: "relative",
            }}
        >
            <AskToArchivePopup
                isOpen={isArchiveOpen}
                onClose={() => setIsArchiveOpen(false)}
                handleDelete={handleDelete}
                id={archiveId}
                handleUnarchive={handleUnarchive}
                archiveStatus={archiveStatus}
            />
            <JobListingPreviewPopup
                isOpen={isOpenPreview}
                onClose={() => setIsOpenPreview(false)}
                data={data[previewIndex]}
                handleDelete={handleDelete}
                handleArchive={handleArchive}
            />
            {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>}
            <BulkUploadDrawer
                isOpen={isOpen}
                onClose={onClose}
                id={jobId}
            />
            <Box
                sx={{
                    height: "100vh",
                    overflow: "auto",
                    backgroundColor: "#FFFFFF",
                }}
            >
                <table
                    // @ts-ignore
                    style={{
                        width: "100%",
                        textAlign: "left",
                        borderCollapse: "collapse",
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
                                    textAlign: "left",
                                }}
                                width="20%"
                            >
                                <Box
                                    display='flex'
                                    justifyContent={'flex-start'}
                                    gap='5px'
                                >
                                    Job Listing Name <img src={a2zIcon.src} alt='icon' style={{ width: '16px', height: '16px' }} />
                                </Box>
                            </th>

                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,
                                }}
                                width="12%"
                            >
                                <Box
                                    display='flex'
                                    justifyContent={'flex-start'}
                                    gap='5px'
                                >
                                    No.of Applicants <img src={a2zIcon.src} alt='icon' style={{ width: '16px', height: '16px' }} />
                                </Box>
                            </th>

                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,
                                }}
                                width="10%"
                            >
                                <Box
                                    display='flex'
                                    justifyContent={'flex-start'}
                                    gap='5px'
                                >
                                    Creation Date <img src={tableSortIcon.src} alt='icon' style={{ width: '16px', height: '16px' }} />
                                </Box>

                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,
                                }}
                                width="10%"
                            >
                                <Box
                                    display='flex'
                                    justifyContent={'center'}
                                    gap='5px'
                                >
                                    Current Status <img src={tableSortIcon.src} alt='icon' style={{ width: '16px', height: '16px' }} />
                                </Box>

                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,
                                }}
                                width="20%"
                            >
                                Bulk Upload Resume
                            </th>
                            <th
                                scope="col"
                                // @ts-ignore
                                style={{
                                    ...textStyle,
                                    fontWeight: 600,
                                }}
                                width="7%"
                            >
                                Actions
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
                                    // @ts-ignore
                                    style={{
                                        backgroundColor: isHovered == index ? '#E4E4F0' : checkEvenOrOdd(index) ? "#F9F9FC" : "#FFFFFF",
                                        // cursor: 'pointer'
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
                                        style={{
                                            ...textStyle,
                                            textAlign: "left",
                                            fontSize: "12px",
                                            color: '#043A87',
                                            textDecoration: 'underline',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <a
                                            href="#"
                                            style={{
                                                color: '#043A87',
                                                textDecoration: 'underline'
                                            }}
                                            onClick={() => handlePreview(index)}
                                        >
                                            {application.job_title ?? '--'}
                                        </a>
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{ ...textStyle, textAlign: "left" }}
                                    >
                                        {application.total_candidates ?? '--'}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{
                                            ...textStyle,
                                            color: "#043A87",
                                            textAlign: "left",
                                        }}
                                    >
                                        {application.date_of_creation ? dayjs(application.date_of_creation).format('DD/MM/YYYY') : '--'}
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={textStyle}
                                    >
                                        <span
                                            // @ts-ignore
                                            style={{
                                                backgroundColor: application.delete_flag === true ? "#E7EFFC" : application.delete_flag === false ? "#E7FCF3" : '',
                                                padding: "8px",
                                                color: application.delete_flag === true ? '#2877EE' : application.delete_flag === false ? '#09AA61' : '--',
                                                fontWeight: 700,
                                                fontSize: '10px',
                                                textAlign: "center",
                                                borderRadius: "4px",
                                                border: `1px solid ${application.delete_flag === true ? '#2877EE' : application.delete_flag === false ? '#09AA61' : ''}`
                                            }}
                                        >
                                            {application.delete_flag === true ? 'Archived' : application.delete_flag === false ? 'Active' : '--'}
                                        </span>
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{ ...textStyle, textAlign: "center" }}
                                    >
                                        <span style={{
                                            color: "#003D86",
                                            fontSize: "12px",
                                            fontWeight: 500,
                                            cursor: application?.id ? "pointer" : '',
                                            textDecoration: "underline"
                                        }}
                                            onClick={() => application?.id ? handleBulkUpload(application?.id) : () => { }}
                                        >+Upload Resumes</span>
                                    </td>
                                    <td
                                        // @ts-ignore
                                        style={{ ...textStyle, textAlign: "center", width: "8%" }}
                                    >

                                        <Box
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "10px",

                                            }}
                                        >
                                            {/* @ts-ignore */}

                                            <Tooltip
                                                label={'Edit'}
                                                placement="bottom"
                                                bg={'#E4E4F0'}
                                                color={'#000000'}
                                                borderRadius={'4px'}
                                            >
                                                <TooltipCard>
                                                    <img src={editIcon.src}
                                                        alt="icon"

                                                        onClick={() => !application.delete_flag ? handleEdit(application?.id) : () => { }}
                                                        style={{ opacity: application.delete_flag ? 0.2 : 1, cursor: application.delete_flag ? '' : "pointer" }}
                                                    />
                                                </TooltipCard>
                                            </Tooltip>
                                            <Tooltip
                                                label={'Copy'}
                                                placement="bottom"
                                                bg={'#E4E4F0'}
                                                color={'#000000'}
                                                borderRadius={'4px'}
                                            // minWidth={width}
                                            >
                                                <TooltipCard>
                                                    <img
                                                        src={copy.src}
                                                        alt="icon"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => copyToClipboard(index)}
                                                    />
                                                </TooltipCard>
                                            </Tooltip>
                                            {/* @ts-ignore */}
                                            <Tooltip
                                                label={application.delete_flag ? 'Unarchive' : 'Archive'}
                                                placement="bottom"
                                                bg={'#E4E4F0'}
                                                color={'#000000'}
                                                borderRadius={'4px'}
                                            // minWidth={width}
                                            >
                                                <TooltipCard>
                                                    <img
                                                        src={deleteIcon.src}
                                                        alt="icon"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleArchive(application?.id, application.delete_flag, application?.job_title)}
                                                    />
                                                </TooltipCard>
                                            </Tooltip>
                                        </Box>
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
                                    colSpan={7}
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
                                    setPerPage(value)
                                    setCurrentPage(1)
                                }}
                                placeholder=''
                                menuPlacement='top'
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
        </Box>
    );
};

export default JobListingTable;
