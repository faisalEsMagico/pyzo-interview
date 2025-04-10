import React from 'react'
import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay
} from '@chakra-ui/react'
import deleteIcon from "../../assets/svg/deleteIconsvg.svg"

const OverlayOne = () => (
    <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(1px) hue-rotate(90deg)'
    />
)

const SkillDeletePopup = ({ isOpen, onClose, setIsSkillDeletePopup, id, skillName, handleDeleteSkill, setDeleteSkillData }:
    {
        isOpen: boolean,
        onClose: () => void,
        setIsSkillDeletePopup: (isOpen: boolean) => void,
        id: number | string,
        skillName: string,
        handleDeleteSkill: (id: number | string) => void,
        setDeleteSkillData: ({ }: any) => void,
    }) => {

    const handleClose = () => {
        // @ts-ignore
        setIsSkillDeletePopup(false);
        setDeleteSkillData({ id: "", skillName: "" })
    }

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size='xl'>
            {OverlayOne()}
            {/* @ts-ignore */}
            <ModalContent sx={{ borderRadius: "16px" }}>
                <ModalCloseButton color={'rgba(40, 44, 54, 1)'} onClick={handleClose} />
                <ModalBody padding={30} sx={{ backgroundColor: "#FFFFFF", borderRadius: "12px" }} >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <img src={deleteIcon.src} style={{ width: "60px", height: "60px" }} alt="delete_icon" />
                    </Box>
                    <Box
                        sx={{
                            fontSize: "24px",
                            fontWeight: 600,
                            color: "#282C36",
                            textAlign: "center",
                            marginTop: "25px"
                        }}
                    >
                        {`Are you sure you want to delete`} <br /> {`${skillName} skill`}
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
                    </Box>
                    <Box sx={{ marginTop: "47px", display: "flex", justifyContent: "center", gap: "11px" }}>
                        <Button
                            onClick={handleClose}
                            _hover={{ bg: '#B9D9FF' }}
                            _active={{ bg: '#B9D9FF' }}
                            color={'#003D86'}
                            bg={'#B9D9FF'}
                            fontSize={'16px'}
                            fontWeight={500}
                            px={'30px'}
                            width={"200px"}
                        >
                            No
                        </Button>
                        <Button
                            onClick={() => handleDeleteSkill(id)}
                            _hover={{ bg: '#003D86' }}
                            _active={{ bg: '#003D86' }}
                            color={'#F3F3F3'}
                            bg={'#003D86'}
                            variant='solid'
                            fontSize={'16px'}
                            fontWeight={500}
                            px={'27px'}
                            width={"200px"}
                        >
                            Yes
                        </Button>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default SkillDeletePopup