import {
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import resumeIcon from '../../assets/svg/resumeIcon.svg'
import BulkUploadButton from './BulkUploadButton'
import { getShortlistedCandidate, postBulkUpload } from '../../services/jobListingApi'
import toast from 'react-hot-toast'
import { Backdrop, CircularProgress } from '@material-ui/core'

const BulkUploadDrawer = ({ isOpen, onClose, id, }: { isOpen: boolean, onClose: () => void, id: number }) => {
    const [loading, setLoading] = useState(false)
    const [loadingUpload, setLoadingUpload] = useState(false)

    const [resumes, setResumes] = useState([]);
    const [fetchCandidateResume, setFetchCandidateResume] = useState(false)

    const handleBulkUpload = async (selectedFiles: any) => {
        console.log('bulk upload', selectedFiles)
        const formData = new FormData();
        // @ts-ignore
        formData.append('job_id', id)
        selectedFiles.forEach((file: File) => {
            formData.append('resumes', file);
        });
        try {
            setLoadingUpload(true)
            const resp = await postBulkUpload(formData)
            toast.success("Resume Uploaded Successfully!")
            setLoadingUpload(false)
            setFetchCandidateResume((pre) => !pre)
        } catch (e) {
            console.log('error while calling bulk upload api:-', e)
            toast.error("Something went wrong. Please try again!")
            setLoadingUpload(false)
        }
    }

    const handleShortListingCandidate = async (id: number) => {
        setLoading(true)
        try {
            const resp = await getShortlistedCandidate(id)
            setResumes(resp?.candidates)
            setLoading(false)
        } catch (e) {
            console.log('error while calling shortlisting candidate Api:-', e)
            setResumes([])
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            handleShortListingCandidate(id)
        }
    }, [id, fetchCandidateResume])

    return (
        <>
            {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>}
            {/* @ts-ignore */}
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
            >
                <DrawerOverlay />
                {/* @ts-ignore */}
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader sx={{ fontSize: "14px", fontWeight: 600, color: "#1D1F2C" }}>Applicants Resume</DrawerHeader>

                    <DrawerBody>
                        {resumes && resumes.length > 0 ? resumes?.map((item: any, i: number) => {
                            return <Box key={i}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginTop: "12px"
                                    }}
                                >
                                    <Box
                                        sx={{
                                            fontSize: "12px",
                                            fontWeight: 400,
                                            color: '#131313',
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "10px",
                                            alignItems: "center"
                                        }}
                                    >
                                        <img src={resumeIcon.src} alt="icon" />  {item?.name}
                                    </Box>
                                    <Box
                                        sx={{
                                            textDecoration: "underline",
                                            color: "#003D86",
                                            fontWeight: 700,
                                            fontSize: '12px',
                                        }}
                                    >View Resume</Box>
                                </Box>
                            </Box>
                        }) : <Box sx={{ fontSize: "12px", fontWeight: 500 }} >No resumes found for this job.</Box>}
                    </DrawerBody>

                    <DrawerFooter
                        sx={{ display: "flex", justifyContent: "center" }}
                    >
                        <BulkUploadButton onChange={handleBulkUpload} isLoading={loadingUpload} />
                    </DrawerFooter>
                </DrawerContent >
            </Drawer >
        </>
    )
}

export default BulkUploadDrawer