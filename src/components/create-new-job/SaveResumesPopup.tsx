import React from 'react'
import {
    Box,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'

const SaveResumesPopup = ({ isOpen, onClose, data }: any) => {

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
                    paddingRight={'60px'}
                >
                    Resumes
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                    <Box
                        fontSize={'14px'}
                        fontWeight={600}
                        mt='22px'
                        mb='10px'
                    >
                        List of Resumes
                    </Box>
                    <Box
                        mb={'30px'}
                    >
                        {data && data.length > 0 ? <Box
                            height={'200px'}
                            overflow={'auto'}
                            display={'flex'}
                            flexDirection={'column'}
                            paddingLeft={'5px'}
                            color={'#043A87'}
                            textDecoration={'underline'}
                        >
                            {data?.map((item: any, i: number) => {
                                return <a key={i} href='item' target='_blank' >{item?.name}</a>
                            })}

                        </Box> : <Box fontSize={'12px'}>No Resumes</Box>}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}

export default SaveResumesPopup