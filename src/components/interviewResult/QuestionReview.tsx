import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react'
import React from 'react'

const QuestionReview = ({ question, answer, logic, skill, level, confidence, index }:
    {
        question: string, answer: string, skill: string, logic: string,
        index: number, level: number, confidence: number
    }) => {
    return (
        // @ts-ignore
        <Accordion allowMultiple
            sx={{
                borderLeft: "1px solid #E2E8F0",
                borderRight: "1px solid #E2E8F0",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "15px"
            }}>
            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: 300,
                                fontSize: "12px"
                            }}
                            as='span'
                            flex='1'
                            textAlign='left'>
                            <span style={{
                                backgroundColor: "#5D79C2",
                                padding: "1px 6px",
                                borderRadius: "50%",
                                fontWeight: 900,
                                fontSize: "12px",
                                color: "#FFFFFF",
                                marginRight: "10px"
                            }} >{index}</span> {question}
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "start",
                            gap: "50px",
                        }}
                    >
                        <Box >
                            <Box sx={{
                                fontWeight: 500,
                                fontSize: "12px",
                                color: '#272727',
                                marginBottom: "16px",
                                width: "40vw",
                            }}
                            >
                                Answer:
                            </Box>
                            <Box
                                sx={{
                                    fontWeight: 300,
                                    fontSize: "10px"
                                }}
                            >
                                {answer}
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: '#F6F6F6',
                                borderRadius: "10px",
                                padding: "16px",
                                width: "40vw",
                            }}
                        >
                            <Box
                                sx={{ marginBottom: "16px", display: "flex", gap: "10px" }}
                            >
                                <Box>
                                    <span
                                        style={{
                                            fontWeight: 500,
                                            fontSize: "12px",
                                            color: '#272727',
                                            marginRight: "10px"
                                        }}
                                    >
                                        Skill:
                                    </span>
                                    <span style={{
                                        fontWeight: 700,
                                        fontSize: "12px",
                                        color: "#000000",
                                        padding: "6px",
                                        borderRadius: "4px"
                                    }}
                                    >
                                        {skill}
                                    </span>
                                </Box>
                                <Box>
                                    <span
                                        style={{
                                            fontWeight: 500,
                                            fontSize: "12px",
                                            color: '#272727',
                                            marginRight: "10px"
                                        }}
                                    >
                                        Level:
                                    </span>
                                    <span style={{
                                        fontWeight: 700,
                                        fontSize: "12px",
                                        backgroundColor: level >=7 ? "#009220" : level >=4 ?
                                            "#F4A701" : '#F31212',
                                        color: "#FFFFFF",
                                        padding: "6px",
                                        borderRadius: "4px"
                                    }}
                                    >
                                        {level}
                                    </span>
                                </Box>
                                <Box>
                                    <span
                                        style={{
                                            fontWeight: 500,
                                            fontSize: "12px",
                                            color: '#272727',
                                            marginRight: "10px"
                                        }}
                                    >
                                        Confidence:
                                    </span>
                                    <span style={{
                                        fontWeight: 700,
                                        fontSize: "12px",
                                        backgroundColor: confidence >=7 ? "#009220" : confidence >=4 ?
                                        "#F4A701" : '#F31212',
                                        color: "#FFFFFF",
                                        padding: "6px",
                                        borderRadius: "4px"
                                    }}
                                    >
                                        {confidence}
                                    </span>
                                </Box>
                            </Box>
                            <Box sx={{
                                fontWeight: 500,
                                fontSize: "12px",
                                marginBottom: "16px",
                                color: '#272727'
                            }}
                            >
                                Score Logic:
                            </Box>
                            <Box
                                sx={{
                                    fontWeight: 300,
                                    fontSize: "10px"
                                }}
                            >
                                {logic}
                            </Box>
                        </Box>
                    </Box>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}

export default QuestionReview