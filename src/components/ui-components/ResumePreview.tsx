import { Box } from '@chakra-ui/react'
import React from 'react'
import resumePreview from '../../assets/images/resumePreview.png'
import { TbFileUpload } from 'react-icons/tb'
const ResumePreview = ({ pdfPreview, name, handleParseResume }: { pdfPreview: string, name: string, handleParseResume: (arg: boolean) => void }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: "space-between",
                alignItems: "center",
                marginX: '24px',
                border: '1px solid #2C313B',
                borderRadius: "12px",
                marginBottom: "24px",
                overflow: "hidden"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: "20px",
                    color: "#F3F3F3",
                    backgroundColor: "#0D111B",
                    alignItems: "center",
                    width: "80%",
                    borderRight: "1px solid #2C313B",
                    padding: "16px"
                }}
            >
                <img src={pdfPreview} alt="resume" style={{ height: "100px" }} />
                <Box>{name}</Box>
            </Box>
            <Box
                width='20%'
                display='flex'
                flexDirection={'column'}
                alignItems={'center'}
                onClick={() => handleParseResume(false)}
                cursor={'pointer'}
            >
                <TbFileUpload color="#F3F3F3" size={25} />
                <Box
                    color='#E5E5E5'
                    fontSize={'14px'}
                    fontWeight={600}
                    textAlign={'center'}
                    p={'10px'}
                >
                    Re-Upload Resume
                </Box>
            </Box>
        </Box>
    )
}

export default ResumePreview