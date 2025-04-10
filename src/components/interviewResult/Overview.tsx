import { Box, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import React from 'react'
import HorizontalLabelValuePair from '../ui-components/HorizontalLabelValuePair'
import ShortListingCriteriaTable from '../interview-form/ShortListingCriteriaTable'

const Overview = ({ data }: any) => {
    return (
        <Box>
            <Box
                border='1px solid #E0E2E7'
                borderRadius={'12px'}
                mt='20px'
            >
                <Box
                    fontSize={'12px'}
                    fontWeight={600}
                    color={'#282C36'}
                    opacity={'60%'}
                    p='9px'
                    borderBottom={'1px solid #E0E2E7 '}
                >
                    Evaluation Reason From AI
                </Box>
                <Box
                    p='16px'
                    fontSize={'12px'}
                    color={'#131313'}
                    width={'80%'}

                >
                    {data?.feedback_suitable_position ?? '--'}
                </Box>
            </Box>
            {data?.resume_shortlisting_criteria_evaluation && data?.resume_shortlisting_criteria_evaluation.length > 0 &&
                <Box
                    my={'16px'}
                    borderRadius={'12px'}
                >
                    <ShortListingCriteriaTable
                        HeaderBg='#FFFFFF'
                        bodyBg='#FFFFFF'
                        borderColor='#E4E4E4'
                        color='#000000'
                        criteriaDecisions={data?.resume_shortlisting_criteria_evaluation ?? []}
                        skillevaluations={data?.feedback_skill_evaluation ?? []}
                    />
                </Box>}
        </Box>
    )
}

export default Overview