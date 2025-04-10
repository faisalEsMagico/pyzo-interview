import React, { useRef, useState } from 'react'
import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
} from '@chakra-ui/react'
import archiveImg from '../../assets/images/archiveImg.png'

const AskToArchivePopup = ({ isOpen, onClose, id, handleDelete, handleUnarchive, archiveStatus }: any) => {

    const handleArchive = () => {
        if (archiveStatus?.status) {
            handleUnarchive(id)
        } else {
            handleDelete(id)
        }
        onClose()
    }

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
            
        />
    )
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size='2xl' >
            {OverlayOne()}
            {/* @ts-ignore */}
            <ModalContent sx={{
                    borderRadius: '12px', // Apply border radius here
                    overflow: 'hidden' // Ensure content inside respects the border radius
                }}>

                <ModalCloseButton />
                <ModalBody bg={'#F7F9FC'} p='10px' >
                    <Box>
                        <Box
                            display={'flex'}
                            justifyContent={'center'}
                     
                            flexDirection={'column'}
                            alignItems={'center'}
                            my='40px'
                        >

                            <img src={archiveImg.src} alt="img" />

                            <Box
                                fontSize={'24px'}
                                fontWeight={600}
                                color='#000000'
                                textAlign={'center'}
                                mt='25px'
                                width={'400px'}
                            >
                                Are you sure you want to {archiveStatus?.status ? "unarchive" : 'archive'} {archiveStatus?.jobListingTitle} job listing
                            </Box>
                        </Box>
                        <Box
                            display={'flex'}
                            justifyContent={'center'}
                            gap='10px'
                            mb='28px'
                        >
                            <Button
                                size='small'
                                bg='#B9D9FF'
                                _hover={'#B9D9FF'}
                                _active={'#B9D9FF'}
                                color={'#003D86'}
                                fontSize={'16px'}
                                fontWeight={500}
                                px='100px'
                                py={'10px'}
                                onClick={onClose}
                            >No</Button>
                            <Button
                                size='small'
                                bg='#003D86'
                                _hover={'#003D86'}
                                _active={'#003D86'}
                                color={'#FFFFFF'}
                                fontSize={'16px'}
                                fontWeight={500}
                                px='100px'
                                py={'10px'}
                                onClick={handleArchive}
                            >
                                Yes
                            </Button>
                        </Box>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}

export default AskToArchivePopup