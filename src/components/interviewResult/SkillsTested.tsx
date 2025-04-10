import { Box } from '@chakra-ui/react'
import React from 'react'

const SkillsTested = ({ text, status, reason }:
  { text: string, status: number, reason: string }) => {
    
  return (
    <Box
      sx={{
        fontSize: "12px",
        color: '#737373'
      }}
    >
      <Box>
        {text} <span
          style={{
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "12px",
            padding: "5px 12px",
            marginLeft: "20px",
            backgroundColor: status >= 7 ? '#009220' :
              status >= 4 ? '#F4A701' : '#F31212'
          }}>{status}</span>
      </Box>
      <Box
        sx={{ marginTop: '5px' }}
      >
        <span style={{ fontWeight: 600 }}>Evaluation Reason: </span> {reason}
      </Box>
    </Box>
  )
}

export default SkillsTested