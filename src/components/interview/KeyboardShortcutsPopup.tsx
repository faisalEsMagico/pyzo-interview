import React from 'react'
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'
import styles from './index.module.css'
import { useRouter } from 'next/router'
import cautionIcon from "../../assets/svg/CautionIcon.svg"

const OverlayOne = () => (
    <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(10px) hue-rotate(90deg)'
    />
)

const KeyboardShortcutsPopup = ({ isOpen, onClose, setIsShortcutPopupOpen, handleEditAnswer, handleSend}:
    {
        isOpen: boolean,
        onClose: () => void,
        setIsShortcutPopupOpen: (isOpen: boolean) => void,
        handleEditAnswer: () => void,
        handleSend: () => void,
    }) => {
    const router = useRouter();
    const { candidate_id } = router.query;


    const handleClose = () => {
        // @ts-ignore
        setIsShortcutPopupOpen(false);
    }

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size='xl'>
            {OverlayOne()}
            {/* @ts-ignore */}
            <ModalContent sx={{borderRadius: "16px"}}>
                <ModalCloseButton color={'#F3F3F3'} onClick={handleClose} />
                <ModalBody padding={30} sx={{ backgroundColor: "#2C313B", borderRadius: "12px" }} >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <img src={cautionIcon.src} alt="icon" />
                    </Box>
                    <Box
                        sx={{
                            fontSize: "24px",
                            fontWeight: 600,
                            color: "#F3F3F3",
                            textAlign: "center",
                            marginTop: "25px"
                        }}
                    >
                        Hey just a reminder!
                    </Box>
                    <Box
                        sx={{
                            fontSize: "16px",
                            fontWeight: 400,
                            color: "#F3F3F3",
                            textAlign: "center",
                            marginTop: "14px",
                            opacity: 0.6

                        }}
                    >
                        {`[enter] is to send the answer | [shift+enter] is for a new line`}
                    </Box>
                    <Box
                        sx={{
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#F3F3F3",
                            textAlign: "center",
                            marginTop: "14px",
                        }}
                    >
                        {/* {formatTime()} */}
                    </Box>
                    <div className={styles.buttonContainer} style={{ marginTop: "40px" }}>
                        <Button
                            onClick={handleEditAnswer}
                            _hover={{ bg: '#287EEE' }}
                            _active={{ bg: '#287EEE' }}
                            color={'#F3F3F3'}
                            bg={'#287EEE'}
                            fontSize={'16px'}
                            fontWeight={500}
                            px={'30px'}
                        >
                            Edit Answer
                        </Button>
                        <Button
                            onClick={handleSend}
                            _hover={{ bg: '#6DAA39' }}
                            _active={{ bg: '#6DAA39' }}
                            color={'#F3F3F3'}
                            bg={'#6DAA39'}
                            variant='solid'
                            fontSize={'16px'}
                            fontWeight={500}
                            px={'27px'}
                        >
                            Send Answer
                        </Button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default KeyboardShortcutsPopup