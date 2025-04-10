import { Box } from '@chakra-ui/react';
import React from 'react'
import SkillsTested from './SkillsTested';
import QuestionReview from './QuestionReview';
const Interview = ({ data }: any) => {
    return (
        <div>

            <Box sx={{
                padding: "16px",
                borderBottom: "1px solid #B9BECB",
                height: "160px",
                overflow: 'auto'
            }}>
                <Box sx={{ fontSize: "14", color: "#737373", fontWeight: 600, marginBottom: "18px" }}>
                    Skills Tested
                </Box>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "24px",
                    paddingBottom: "24px",

                }}>
                    {data?.feedback_skill_evaluation?.map((item: any) => {
                        return <SkillsTested key={item?.skill} text={item?.skill} status={item?.score} reason={item?.evaluation_reason} />
                    })}
                </Box>
            </Box>
            <Box sx={{ padding: "16px", height: "250px", overflow: "auto" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ fontSize: "14", color: "#737373", fontWeight: 600, marginBottom: "18px" }}>
                        Questions Review
                    </Box>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                        <Box sx={{ color: '#6F747E', fontSize: "13px", fontWeight: 600 }}>From
                            <span style={{ color: '#272727' }}> 15 </span>
                            Questions</Box>
                        <Box sx={{ color: '#6F747E', fontSize: "13px", fontWeight: 600 }}>Skipped Questions <span style={{ color: '#272727' }}>3</span></Box>
                    </Box>
                </Box>
                {data?.interviews?.map((item: any, index: number) => {
                    return item.questions_responses.map((questions: any, i: number) => {
                        return <QuestionReview
                            key={i}
                            index={index + 1}
                            question={questions?.questions}
                            answer={questions?.response}
                            skill={item?.skill}
                            level={item?.level}
                            confidence={item?.confidence}
                            logic={questions?.evaluation_reason} />
                    })
                })}

            </Box>
        </div>
    )
}

export default Interview