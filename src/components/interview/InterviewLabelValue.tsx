import { Box } from '@chakra-ui/react'
import React from 'react'

const InterviewLabelValue = ({ label, value }: { label: string, value: string }) => {
  return (
    <Box>
      <Box
        sx={{
          color: '#F3F3F3',
          fontSize: "12px"
        }}
      >{label}</Box>
      <Box
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          color: '#E5E5E5',
          marginTop:"4px"
        }}
      >{value}</Box>
    </Box>
  )
}

export default InterviewLabelValue