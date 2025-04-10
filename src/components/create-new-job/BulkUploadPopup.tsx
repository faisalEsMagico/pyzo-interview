import React, { useState } from 'react'
import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'
import DragAndDropMultiUpload from '../draganddrop/DragAndDropMultiUpload'
import { IoIosArrowDown } from 'react-icons/io'
import { postBulkUpload } from '../../services/jobListingApi'
import toast from 'react-hot-toast'
import { CircularProgress } from '@material-ui/core'

const BulkUploadPopup = ({ isOpen, onClose, id, setFetchCandidateResume, title }:
    { isOpen: boolean, id: string, onClose: () => void, setFetchCandidateResume: any, title: string }) => {
    const [resumes, setResumes] = useState<File[]>([])
    const [isDelete, setIsDelete] = useState(false);
    const [loading, setLoading] = useState(false)

    const handleChange = (files: File[]) => {
        setResumes((pre) => {
            return [...pre, ...files]
        })
    }

    const handleBulkUpload = async () => {
        console.log(id)
        if (resumes.length === 0) {
            toast.error("Please select resume!")
            return
        }
        console.log('bulk upload', resumes)
        const formData = new FormData();
        // @ts-ignore
        formData.append('job_id', id)
        resumes.forEach((file: File) => {
            formData.append('resumes', file);
        });
        try {
            setLoading(true)
            const resp = await postBulkUpload(formData)
            toast.success("Resume Uploaded Successfully!")
            setLoading(false)
            onClose()
            setFetchCandidateResume((pre: any) => !pre)
        } catch (e) {
            console.log('error while calling bulk upload api:-', e)
            toast.error("Something went wrong. Please try again!")
            setLoading(false)
        }

    }


    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size='xl'>
            {OverlayOne()}
            {/* @ts-ignore */}
            <ModalContent>
                <ModalHeader
                    bg='#F7F9FC'
                    fontSize={'18px'}
                    fontWeight={600}
                    color='#1D1F2C'
                >
                    Bulk Upload Resumes
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                    <Box
                        fontSize={'14px'}
                        fontWeight={600}
                        mt='22px'
                        mb='18px'
                    >
                        Bulk Upload For
                    </Box>
                    <Box
                        fontSize={'12px'}
                        border='1px solid #E0E2E7'
                        p='8px'
                        display={'flex'}
                        justifyContent={"space-between"}
                        alignItems='center'
                        borderRadius={'6px'}
                    >
                        {title} <IoIosArrowDown size={20} />
                    </Box>
                    <Box
                        mt='18px'
                    >
                        <DragAndDropMultiUpload
                            bgColor='#FFFFFF'
                            color='#0D111B'
                            value={resumes}
                            onChange={(value) => handleChange(value)}
                            // handleDelete={() => setResumes([])}
                            isDelete={isDelete}
                            handleIsDelete={setIsDelete}
                            handleResumes={setResumes}
                        />
                    </Box>
                    <Box
                        my='20px'
                    >
                        <Button
                            onClick={handleBulkUpload}
                            bg={'#003D86'}
                            _hover='#003D86'
                            _active='#003D86'
                            color='#FFFFFF'
                            px='50px'
                            disabled={isDelete}
                        >{loading ? <CircularProgress size={'20px'} color="inherit" /> : "Save"}</Button>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}

export default BulkUploadPopup