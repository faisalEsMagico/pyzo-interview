import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Image from 'next/image';
import React, { useState } from 'react'
import stop from "../../assets/icons/micAnimation.gif";
import styles from './styles.module.css'
import start from "../../assets/icons/mc.svg";
import { useLocalization } from '../../hooks/useLocatization';

const OverlayOne = () => (
    <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(10px) hue-rotate(90deg)'
    />
)

const RecordingPopup = ({ isOpen, onClose, handleStop, note }:
    { isOpen: boolean, onClose: () => void, handleStop: () => void, note: string | null }) => {
    const [showAnimationSpeaker, setShowAnimationSpeaker] = useState(true)
    const t = useLocalization();
    return (
        <div>
            <Modal isCentered isOpen={isOpen} onClose={() => { }}>
                {OverlayOne()}
                <ModalContent>
                    <ModalBody style={{ margin: 'auto', padding: '20px 0px', width: '80%' }}>
                        <div className={styles.center1} >
                            {showAnimationSpeaker ?
                                <Image
                                    priority
                                    src={stop}
                                    height={2}
                                    width={2}
                                    className={styles.image1}
                                    alt="stopIcon"
                                    style={{ cursor: "pointer" }}
                                    layout="responsive"
                                    onClick={() => {
                                        handleStop()
                                        setShowAnimationSpeaker(false)
                                    }}
                                /> : <Image
                                    priority
                                    height={10}
                                    width={10}
                                    src={start}
                                    className={styles.image1}
                                    alt="startIcon"
                                    // onClick={startRecording}
                                    style={{ cursor: "pointer" }}
                                    layout="responsive"
                                />}
                        </div>
                        <div className={styles.audioText}>
                            {note ? note : t('label.tap_to_stop')}
                        </div>
                        <div className={styles.buttonContainer}>
                            <button disabled={showAnimationSpeaker}>{t("label.retry")}</button>
                            <button onClick={onClose}>{t("label.ok")}</button>
                        </div>
                    </ModalBody>

                </ModalContent>
            </Modal>
        </div>
    )
}

export default RecordingPopup