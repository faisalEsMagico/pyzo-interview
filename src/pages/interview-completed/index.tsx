import React from 'react'
import { Box } from '@chakra-ui/react';
import { FaCircleCheck } from 'react-icons/fa6';

const InterviewCompleted = () => {


    return (
        <Box
            bg={'#141926'}
            height={'100vh'}
        >
            <Box
                width={'30%'}
                margin={'auto'}
                pt='200px'

            >
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <Box

                        p='14px'
                        backgroundColor={'#282C36'}
                        borderRadius={'8px'}
                    >
                        <FaCircleCheck color='#6DAA39' size={33} style={{ margin: "auto" }} />
                    </Box>
                </Box>
                <Box
                    fontSize={'24px'}
                    fontWeight={600}
                    color={'#F3F3F3'}
                    textAlign={'center'}
                    mt='25px'
                >
                    Your Interview has ended
                </Box>
                <Box
                    fontSize={'16px'}
                    color={'#F3F3F3'}
                    opacity={0.6}
                    textAlign={'center'}
                    mt='14px'

                >
                    The recruiter will be reaching out to you shorty
                </Box>
            </Box>
        </Box>
    )
}

export default InterviewCompleted