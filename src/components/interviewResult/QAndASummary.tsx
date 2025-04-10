import { Box } from '@chakra-ui/react'
import React from 'react'

const QAndASummary = ({ data }: any) => {
    let questionCounter = 1;
    return (
        <Box>
            {data && data?.length > 0 ? data?.map((item: any,) => {

                return item?.questions_responses?.map((questions: any) => {

                    return <Box
                        key={questions}
                        border='1px solid #E0E2E7'
                        borderRadius={'12px'}
                        mt='20px'
                        overflow={'hidden'}
                    >
                        <Box
                            fontSize={'12px'}
                            fontWeight={600}
                            color={'#667085'}
                            p='9px'
                            borderBottom={'1px solid #E0E2E7 '}
                        >
                            Question. {questionCounter++}
                        </Box>
                        <Box

                            fontSize={'12px'}
                            color={'#131313'}
                            display={'flex'}

                        >
                            <Box
                                width={'60%'}
                                p='16px'
                            >
                                <Box
                                    fontSize={'14px'}
                                    fontWeight={700}
                                    color={'#003D86'}
                                >Question: {questions.questions}</Box>
                                <Box
                                    fontSize={'14px'}
                                    color="#282C36"
                                    mt={'8px'}
                                >
                                    <span style={{ fontWeight: 700 }}>{`Interviewee's`} Answer: </span>
                                    {questions.response === "Skip this Question" ? questions.candidate_response : questions.response}
                                </Box>

                            </Box>
                            <Box width={'40%'} bg='#F7F9FC' p='16px' >
                                <Box>
                                    <Box
                                        fontSize={'12px'}
                                        fontWeight={700}
                                        color={'#858D9D'}
                                    >Skill Tested</Box>
                                    <Box
                                        fontSize={'12px'}
                                        color={'#131313'}
                                        mt={'8px'}
                                    >{item.skill}</Box>
                                </Box>
                                <Box
                                    mt='16px'
                                >
                                    <Box
                                        fontSize={'12px'}
                                        fontWeight={700}
                                        color={'#858D9D'}
                                    >level score</Box>
                                    <Box
                                        fontSize={'12px'}
                                        color={'#131313'}
                                        mt={'8px'}
                                    >{questions?.level && questions?.level != 'N/A' ? `${questions?.level}/10` : '--'}</Box>
                                </Box>
                                <Box
                                    mt='16px'
                                >
                                    <Box
                                        fontSize={'12px'}
                                        fontWeight={700}
                                        color={'#858D9D'}
                                    >Evaluation Reason</Box>
                                    <Box
                                        fontSize={'12px'}
                                        color={'#131313'}
                                        mt={'8px'}
                                    >{questions?.evaluation_reason}</Box>
                                </Box>

                            </Box>
                        </Box>
                    </Box>
                })

            }) : <Box
                fontSize={'12px'}
                textAlign={'center'}
                mt='30px'
            >No Summary</Box>}

        </Box>
    )
}

export default QAndASummary