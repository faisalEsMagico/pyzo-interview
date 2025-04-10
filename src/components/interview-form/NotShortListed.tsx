import { Box } from '@chakra-ui/react'
import React from 'react'
import notShortListed from '../../assets/images/disqualifyIcon.gif'

const NotShortListed = ({ criteriaDecisions }: any) => {
    return (
        <Box
            sx={{
                padding: "24px",
                // paddingTop: "120px",
                fontFamily: "Inter-regular",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: '100px',
                }}
            >
                <img src={notShortListed.src} style={{
                    height: "80px",
                    width: "80px",
                }} alt="icon" />
            </Box>
            <Box
                fontSize={'24px'}
                fontWeight={600}
                color='#F3F3F3'
                textAlign={'center'}
                mt='28px'

            >
                You Have Not Been Shortlisted
            </Box>
            <Box
                fontSize={'16px'}
                opacity={0.6}
                color='#F3F3F3'
                textAlign={'center'}
                mt='12px'
                mb='30px'

            >
                Better Luck Next Time!
            </Box>
        </Box>
    )
}

export default NotShortListed