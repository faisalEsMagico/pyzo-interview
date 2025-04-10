import React from 'react'
import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'

const InterviewJobDescriptionPopup = ({ isOpen, onClose, data }:
    { isOpen: boolean, onClose: () => void, data: any }) => {
        
    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size='3xl'>
            {OverlayOne()}
            {/* @ts-ignore */}
            <ModalContent>
                <ModalCloseButton color={'#E5E5E5'} />
                <ModalBody p='0px' m='0px' >
                    <Box
                        bg='#141926'
                        height={'70vh'}
                        overflow={'auto'}
                    >
                        <Box
                            color='#E5E5E5'
                            fontSize={'18px'}
                            p={'16px 20px'}
                        >
                            Job Listing For {data?.job_title ? data?.job_title : '--'}
                        </Box>
                        <Box
                            bg='#0D111B'
                            color='#E5E5E5'
                            p='20px'
                            fontSize={'14px'}
                            fontWeight={700}
                        >
                            <Box>Job Description</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                                fontSize={'12px'}
                            >{data?.job_description ? data?.job_description : '--'}</Box>
                            <Box>Role And Responsibility</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                                fontSize={'12px'}
                            >{data?.roles_and_responsibilities ? data?.roles_and_responsibilities : '--'}</Box>
                            <Box>About The Company</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                                fontSize={'12px'}
                            >{data?.about_company ? data?.about_company : '--'}</Box>
                            <Box>Skills Required</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                                fontSize={'12px'}
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
                                fontSize={'12px'}
                            >{data?.salary ? data?.salary : '--'}</Box>
                            <Box>What is your expected Location ?</Box>
                            <Box
                                fontWeight={400}
                                marginBottom={'10px'}
                                fontSize={'12px'}
                            >{data?.location ? data?.location : '--'}</Box>
                            <Box>Preferred mode of work</Box>
                            <Box
                                fontWeight={400}
                                fontSize={'12px'}
                            >{data?.mode_of_work ? data?.mode_of_work : '--'}</Box>
                        </Box>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default InterviewJobDescriptionPopup