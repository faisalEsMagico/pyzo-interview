import { Box } from '@chakra-ui/react';
import React from 'react';

const ShortListingCriteriaTable1 = ({ skillevaluations, criteriaDecisions, HeaderBg = '#0D111B', bodyBg = '#FFFFFF', color = '#333333', borderColor = '#E0E2E7' }: any) => {
    const headerStyle = {
        fontFamily: "Inter-regular",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "17px",
        letterSpacing: "0.02em",
        textAlign: "left",
        color: "#282C36",
        opacity: "60%",
        padding: "12px 16px",
    };

    const textStyle = {
        fontFamily: "Inter-regular",
        fontSize: "12px",
        fontWeight: 400,
        lineHeight: "17px",
        letterSpacing: "0.02em",
        textAlign: "left",
        color: "#333333",
        padding: "12px 16px",
    };

    return (
        <>

            {criteriaDecisions && criteriaDecisions.length > 0 && (
                <Box
                    overflow={'auto'}
                    marginBottom={'16px'}
                    borderRadius="12px"
                    border={`1px solid ${borderColor}`}
                    backgroundColor={bodyBg}
                >
                    {/* Resume Evaluation Header */}
                    <table
                        style={{
                            width: '100%',
                            textAlign: 'left',
                            borderCollapse: 'collapse',
                        }}
                    >
                        {/* Resume Evaluation Section Header */}
                        <thead
                            style={{
                                backgroundColor: HeaderBg,
                            }}
                        >
                            <tr>
                                <th colSpan={4} style={{ padding: '15px', fontWeight: 'bold', textAlign: 'left', fontSize: '12px', borderBottom: `2px solid ${borderColor}`, color: "#282C36", opacity: "60%" }}>
                                    Overall Resume Summary
                                </th>
                            </tr>
                            <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                                <th style={{ ...headerStyle, width: '10%' }}>Sr. No.</th>
                                <th style={{ ...headerStyle, width: '20%' }}>Criteria</th>
                                <th style={{ ...headerStyle, textAlign: 'center', width: '20%' }}>Score Out Of 10</th>
                                <th style={{ ...headerStyle, width: '50%' }}>Evaluation Reason</th>
                            </tr>
                        </thead>

                        <tbody style={{ backgroundColor: bodyBg }}>
                            {criteriaDecisions?.map((item: any, i: number) => (
                                item.criteria === 'Overall score' && (  // Check if item.criteria is 'Overall score'
                                    <tr key={i} style={{ borderBottom: `1px solid ${borderColor}` }}>
                                        <td style={{ ...textStyle }}>{i + 1}</td>
                                        <td style={{ ...textStyle }}>{item.criteria}</td>
                                        <td style={{ ...textStyle, textAlign: 'center' }}>{item.score}</td>
                                        <td style={{ ...textStyle }}>{item.evaluation_reason}</td>
                                    </tr>
                                )
                            ))}

                        </tbody>
                    </table>
                </Box>
            )}
            {/* Resume Evaluation Section */}
            {criteriaDecisions && criteriaDecisions.length > 0 && (
                <Box
                    overflow={'auto'}
                    marginBottom={'16px'}
                    borderRadius="12px"
                    border={`1px solid ${borderColor}`}
                    backgroundColor={bodyBg}
                >
                    {/* Resume Evaluation Header */}
                    <table
                        style={{
                            width: '100%',
                            textAlign: 'left',
                            borderCollapse: 'collapse',
                        }}
                    >
                        {/* Resume Evaluation Section Header */}
                        <thead
                            style={{
                                backgroundColor: HeaderBg,
                            }}
                        >
                            <tr>
                                <th colSpan={4} style={{ padding: '15px', fontWeight: 'bold', textAlign: 'left', fontSize: '12px', borderBottom: `2px solid ${borderColor}`, color: "#282C36", opacity: "60%" }}>
                                    Resume Evaluation
                                </th>
                            </tr>
                            <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                                <th style={{ ...headerStyle, width: '10%' }}>Sr. No.</th>
                                <th style={{ ...headerStyle, width: '20%' }}>Criteria</th>
                                <th style={{ ...headerStyle, textAlign: 'center', width: '20%' }}>Score Out Of 10</th>
                                <th style={{ ...headerStyle, width: '50%' }}>Evaluation Reason</th>
                            </tr>
                        </thead>

                        <tbody style={{ backgroundColor: bodyBg }}>
                            {criteriaDecisions
                                ?.filter((item: any) => item.criteria !== 'Overall score')
                                .map((item: any, i: number) => (
                                    <tr key={i} style={{ borderBottom: `1px solid ${borderColor}` }}>
                                        <td style={{ ...textStyle }}>{i + 1}</td>
                                        <td style={{ ...textStyle }}>{item.criteria}</td>
                                        <td style={{ ...textStyle, textAlign: 'center' }}>{item.score}</td>
                                        <td style={{ ...textStyle }}>{item.evaluation_reason}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Box>
            )}
        </>
    );
};

export default ShortListingCriteriaTable1;
